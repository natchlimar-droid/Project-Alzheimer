import type { CDTResult, ClockDrawingTelemetry } from "../types/clinical.ts";

export interface Point2D {
  x: number;
  y: number;
}

export interface CDTGeometricAnalysis {
  suggestedResult: CDTResult;
  confidencePercent: number;
  contourPresent: boolean;
  quadrantCoverage: [boolean, boolean, boolean, boolean]; // Q1(TR), Q2(BR), Q3(BL), Q4(TL)
  handTo11Detected: boolean;
  handTo2Detected: boolean;
  motorTremorDetected: boolean;
  tremorRmsJitterPx: number;
  tremorDirectionReversalRate: number;
  findingsTh: string[];
}

/**
 * 5-Point Symmetric Moving-Average Kinematic Filter
 * Attenuates high-frequency motor tremor (4–12 Hz Parkinsonian / Essential Tremor)
 * while preserving macro-spatial trajectory (circle contour, quadrant placement, hand vector angles).
 */
export function smoothStrokeForTremor(stroke: Point2D[], radius = 2): Point2D[] {
  if (!stroke || stroke.length <= 3) return stroke ? [...stroke] : [];
  const smoothed: Point2D[] = [];
  for (let i = 0; i < stroke.length; i++) {
    // Keep endpoints anchored so clock hand origin/tip vectors remain accurate
    if (i === 0 || i === stroke.length - 1) {
      smoothed.push({ x: stroke[i].x, y: stroke[i].y });
      continue;
    }
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let k = Math.max(0, i - radius); k <= Math.min(stroke.length - 1, i + radius); k++) {
      sumX += stroke[k].x;
      sumY += stroke[k].y;
      count++;
    }
    smoothed.push({ x: sumX / count, y: sumY / count });
  }
  return smoothed;
}

/**
 * Quantifies High-Frequency Oscillatory Motor Tremor vs Smooth Stroke Execution
 * Separates motoric hand tremor (Parkinsonism / Essential Tremor / Senile Tremor)
 * from cognitive visuospatial disorganization.
 */
export function detectMotorTremorFromStrokes(strokes: Point2D[][]): {
  motorTremorDetected: boolean;
  tremorRmsJitterPx: number;
  tremorDirectionReversalRate: number;
  smoothedStrokes: Point2D[][];
} {
  const smoothedStrokes = strokes.map((s) => smoothStrokeForTremor(s, 2));
  let sumSqResidual = 0;
  let residualCount = 0;
  let angleSignFlips = 0;
  let segmentPairs = 0;

  for (let sIdx = 0; sIdx < strokes.length; sIdx++) {
    const raw = strokes[sIdx];
    const sm = smoothedStrokes[sIdx];
    if (raw.length < 5) continue;

    for (let i = 1; i < raw.length - 1; i++) {
      const dx = raw[i].x - sm[i].x;
      const dy = raw[i].y - sm[i].y;
      sumSqResidual += dx * dx + dy * dy;
      residualCount++;
    }

    let prevCrossSign = 0;
    for (let i = 1; i < raw.length - 1; i++) {
      const v1x = raw[i].x - raw[i - 1].x;
      const v1y = raw[i].y - raw[i - 1].y;
      const v2x = raw[i + 1].x - raw[i].x;
      const v2y = raw[i + 1].y - raw[i].y;
      const cross = v1x * v2y - v1y * v2x;
      const sign = cross > 1.5 ? 1 : cross < -1.5 ? -1 : 0;
      if (sign !== 0) {
        if (prevCrossSign !== 0 && sign !== prevCrossSign) {
          angleSignFlips++;
        }
        prevCrossSign = sign;
      }
      segmentPairs++;
    }
  }

  const tremorRmsJitterPx =
    residualCount > 0 ? Number(Math.sqrt(sumSqResidual / residualCount).toFixed(2)) : 0;
  const tremorDirectionReversalRate =
    segmentPairs > 0 ? Number((angleSignFlips / segmentPairs).toFixed(2)) : 0;

  const motorTremorDetected =
    tremorRmsJitterPx >= 1.8 && tremorDirectionReversalRate >= 0.25;

  return {
    motorTremorDetected,
    tremorRmsJitterPx,
    tremorDirectionReversalRate,
    smoothedStrokes,
  };
}

/**
 * Automated Geometric & Kinematic Heuristic Analyzer for Clock Drawing Test (11:10)
 * Evaluates macro-spatial placement AFTER compensating for motor tremor so patients with
 * Parkinsonian/essential hand tremor are not falsely penalized for cognitive impairment.
 */
export function analyzeClockDrawingStrokes(
  strokes: Point2D[][],
  canvasWidth = 460,
  canvasHeight = 460,
  telemetry?: Partial<ClockDrawingTelemetry>
): CDTGeometricAnalysis {
  const findingsTh: string[] = [];

  if (!strokes || strokes.length < 3) {
    return {
      suggestedResult: "ABNORMAL",
      confidencePercent: 95,
      contourPresent: false,
      quadrantCoverage: [false, false, false, false],
      handTo11Detected: false,
      handTo2Detected: false,
      motorTremorDetected: false,
      tremorRmsJitterPx: 0,
      tremorDirectionReversalRate: 0,
      findingsTh: [
        "จำนวนเส้นที่วาดน้อยเกินไป (< 3 เส้น) ไม่พบองค์ประกอบของหน้าปัดนาฬิกาที่สมบูรณ์",
      ],
    };
  }

  // Step 0: Separate High-Frequency Motor Tremor from Macro-Spatial Geometry
  const tremorAnalysis = detectMotorTremorFromStrokes(strokes);
  const evalStrokes = tremorAnalysis.smoothedStrokes;

  const allPoints: Point2D[] = evalStrokes.flat();
  if (allPoints.length < 15) {
    return {
      suggestedResult: "ABNORMAL",
      confidencePercent: 90,
      contourPresent: false,
      quadrantCoverage: [false, false, false, false],
      handTo11Detected: false,
      handTo2Detected: false,
      motorTremorDetected: tremorAnalysis.motorTremorDetected,
      tremorRmsJitterPx: tremorAnalysis.tremorRmsJitterPx,
      tremorDirectionReversalRate: tremorAnalysis.tremorDirectionReversalRate,
      findingsTh: ["ข้อมูลจุดพิกัดบนหน้าปัดไม่เพียงพอสำหรับการประเมินรูปทรง"],
    };
  }

  if (tremorAnalysis.motorTremorDetected) {
    findingsTh.push(
      `🤚 ตรวจพบความสั่นพริ้วของเส้นแบบ Motor Tremor (RMS Jitter = ${tremorAnalysis.tremorRmsJitterPx} px, Oscillation Rate = ${Math.round(
        tremorAnalysis.tremorDirectionReversalRate * 100
      )}%) ระบบได้กรองความสั่นของกล้ามเนื้อมือออกก่อนประเมินตำแหน่งตัวเลขและเข็มนาฬิกา เพื่อไม่ให้หักคะแนนความจำผิดมิติ`
    );
  }

  // Compute bounding box and estimated clock center on smoothed trajectory
  const xs = allPoints.map((p) => p.x);
  const ys = allPoints.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const boxWidth = maxX - minX;
  const boxHeight = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const radiusEst = Math.max(boxWidth, boxHeight) / 2;

  // 1. Check circular contour size & aspect ratio
  const aspectRatio = boxHeight > 0 ? boxWidth / boxHeight : 0;
  const contourPresent =
    boxWidth >= canvasWidth * 0.35 &&
    boxHeight >= canvasHeight * 0.35 &&
    aspectRatio >= 0.65 &&
    aspectRatio <= 1.45;

  if (!contourPresent) {
    findingsTh.push(
      "ขอบเขตหน้าปัดนาฬิกามีขนาดเล็กเกินไปหรือบิดเบี้ยวไม่สมมาตร (Visuospatial Distortion)"
    );
  } else {
    findingsTh.push("ตรวจพบโครงร่างหน้าปัดนาฬิกาสมมาตรในเกณฑ์ดี");
  }

  // 2. Check stroke distribution across 4 quadrants relative to center (cx, cy)
  const qCounts = [0, 0, 0, 0];
  for (const pt of allPoints) {
    if (pt.x >= cx && pt.y < cy) qCounts[0]++;
    else if (pt.x >= cx && pt.y >= cy) qCounts[1]++;
    else if (pt.x < cx && pt.y >= cy) qCounts[2]++;
    else qCounts[3]++;
  }

  const minPointsPerQuadrant = Math.max(3, Math.floor(allPoints.length * 0.05));
  const quadrantCoverage: [boolean, boolean, boolean, boolean] = [
    qCounts[0] >= minPointsPerQuadrant,
    qCounts[1] >= minPointsPerQuadrant,
    qCounts[2] >= minPointsPerQuadrant,
    qCounts[3] >= minPointsPerQuadrant,
  ];
  const coveredQuadrantCount = quadrantCoverage.filter(Boolean).length;

  if (coveredQuadrantCount < 4) {
    findingsTh.push(
      `พบการกระจายตัวของตัวเลข/เส้นครอบคลุมเพียง ${coveredQuadrantCount}/4 จตุภาค (อาจมีภาวะละเลยกึ่งด้าน Hemispatial Neglect หรือวางตำแหน่งตัวเลขกระจุกตัว)`
    );
  } else {
    findingsTh.push("การกระจายตัวขององค์ประกอบครบทั้ง 4 จตุภาคของหน้าปัด");
  }

  // 3. Detect clock hands pointing to 11 (-120 deg) and 2 (-30 deg)
  // Allow slightly wider angular tolerance (32 deg) when motor tremor is detected
  let handTo11Detected = false;
  let handTo2Detected = false;
  const angleTol = tremorAnalysis.motorTremorDetected ? 32 : 28;
  const centerTolerance = radiusEst * 0.44;

  for (const stroke of evalStrokes) {
    if (stroke.length < 2) continue;
    const start = stroke[0];
    const end = stroke[stroke.length - 1];

    const distStart = Math.hypot(start.x - cx, start.y - cy);
    const distEnd = Math.hypot(end.x - cx, end.y - cy);

    if (distStart <= centerTolerance && distEnd > radiusEst * 0.28) {
      const angleDeg = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
      if (isAngleNear(angleDeg, -120, angleTol)) handTo11Detected = true;
      if (isAngleNear(angleDeg, -30, angleTol)) handTo2Detected = true;
    } else if (distEnd <= centerTolerance && distStart > radiusEst * 0.28) {
      const angleDeg = (Math.atan2(start.y - end.y, start.x - end.x) * 180) / Math.PI;
      if (isAngleNear(angleDeg, -120, angleTol)) handTo11Detected = true;
      if (isAngleNear(angleDeg, -30, angleTol)) handTo2Detected = true;
    }
  }

  if (handTo11Detected && handTo2Detected) {
    findingsTh.push(
      "ตรวจพบทิศทางเข็มนาฬิกาชี้ไปทางตำแหน่ง 11 นาฬิกา และ 2 นาฬิกา (11:10 น.) ถูกต้อง"
    );
  } else if (handTo11Detected || handTo2Detected) {
    findingsTh.push(
      "ตรวจพบเข็มนาฬิกาชี้ทิศทางถูกต้องเพียงเข็มเดียว (อาจสับสนตำแหน่งคำว่า '10 นาที' ไปชี้เลข 10 แทนเลข 2)"
    );
  } else {
    findingsTh.push(
      "ไม่พบเส้นเข็มนาฬิกาจากจุดศูนย์กลางที่ชี้ไปยังตำแหน่ง 11:10 น. อย่างชัดเจน"
    );
  }

  // 4. Kinematic Hesitation Telemetry Check
  if (
    telemetry?.hesitationIntervalsMs &&
    telemetry.hesitationIntervalsMs.length > 0
  ) {
    const maxHesitation = Math.max(...telemetry.hesitationIntervalsMs);
    if (maxHesitation > 5000) {
      findingsTh.push(
        `พบช่วงเวลาลังเลระหว่างวาดสูงสุด ${(maxHesitation / 1000).toFixed(
          1
        )} วินาที (> 5 วินาที) บ่งชี้การวางแผนบริหารจัดการช้าลง`
      );
    }
  }

  const isNormal =
    contourPresent &&
    coveredQuadrantCount === 4 &&
    handTo11Detected &&
    handTo2Detected &&
    strokes.length >= 6;

  const confidencePercent = isNormal ? 89 : 85;

  return {
    suggestedResult: isNormal ? "NORMAL" : "ABNORMAL",
    confidencePercent,
    contourPresent,
    quadrantCoverage,
    handTo11Detected,
    handTo2Detected,
    motorTremorDetected: tremorAnalysis.motorTremorDetected,
    tremorRmsJitterPx: tremorAnalysis.tremorRmsJitterPx,
    tremorDirectionReversalRate: tremorAnalysis.tremorDirectionReversalRate,
    findingsTh,
  };
}

function isAngleNear(angleDeg: number, targetDeg: number, toleranceDeg: number): boolean {
  const diff = ((angleDeg - targetDeg + 540) % 360) - 180;
  return Math.abs(diff) <= toleranceDeg;
}
