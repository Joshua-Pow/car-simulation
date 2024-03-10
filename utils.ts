function linearInterpolation(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function getIntersection(A: Coord, B: Coord, C: Coord, D: Coord) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linearInterpolation(A.x, B.x, t),
        y: linearInterpolation(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polygonIntersection(polygon1: Coord[], polygon2: Coord[]) {
  for (let i = 0; i < polygon1.length; i++) {
    const A = polygon1[i];
    const B = polygon1[(i + 1) % polygon1.length];
    for (let j = 0; j < polygon2.length; j++) {
      const C = polygon2[j];
      const D = polygon2[(j + 1) % polygon2.length];
      if (getIntersection(A, B, C, D)) {
        return true;
      }
    }
  }
  return false;
}
