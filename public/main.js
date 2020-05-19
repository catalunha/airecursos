function zinv(p) {
  const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
  const a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
  const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
  const b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
  const c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
  const c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
  const d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
  const p_low = 0.02425, p_high = 1 - p_low;
  let q, r;
  let retVal;
  if ((p < 0) || (p > 1)) {
    alert("A probabilidade p esta fora da faixa. O Correto é 0 <= p <=1.");
    retVal = 0;
  }
  else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  }
  else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  return retVal;
}

function zProb(z) {
  if (z < -7) {
    return 0.0;
  }
  if (z > 7) {
    return 1.0;
  }
  if (z < 0.0) {
    flag = true;
  }
  else {
    flag = false;
  }
  z = Math.abs(z);
  b = 0.0;
  s = Math.sqrt(2) / 3 * z;
  HH = .5;
  for (let i = 0; i < 12; i++) {
    a = Math.exp(-HH * HH / 9) * Math.sin(HH * s) / HH;
    b = b + a;
    HH = HH + 1.0;
  }
  p = .5 - b / Math.PI;
  //p=b/Math.PI;
  if (!flag) {
    p = 1.0 - p;
  }
  return p;
}
var ctx, h, w, box
var inset = 20
function clearFields() {
  document.getElementById("belowInverse").value = ""
  document.getElementById("aboveInverse").value = ""
  document.getElementById("betweenInverse").value = ""
  document.getElementById("outsideInverse").value = ""
}
function rect(x1, y1, x2, y2) {
  this.x1 = x1
  this.x2 = x2
  this.y1 = y1
  this.y2 = y2
}
function linTran(x0, xf, y0, yf) {
  // finds b and a for transforming from x to y
  r = new Array(2)
  r[1] = (yf - y0) / (xf - x0);
  r[0] = (yf + y0) / 2 - r[1] * (xf + x0) / 2;
  return r
}
function init() {
  canvas = document.getElementById('normalCanvas');
  ctx = canvas.getContext('2d');
  h = canvas.height
  w = canvas.width
  var x1 = inset
  var x2 = x1 + w - 2 * inset
  var y1 = inset
  var y2 = y1 + h - 2 * inset
  box = new rect(x1, y1, x2, y2)
}
function draw2() {

  var pField = document.getElementById("p")
  var M = parseFloat(document.getElementById("mean").value)
  var sd = parseFloat(document.getElementById("sd").value)
  var tail = false
  if (document.form1.area[0].checked) {
    ll = parseFloat(document.getElementById("above").value)
    ul = 999999
    z = (M - ll) / sd
    pField.value = Math.round(zProb(z) * 10000) / 10000
  }
  else if (document.form1.area[1].checked) {
    ul = parseFloat(document.getElementById("below").value)
    ll = -999999
    z = (M - ul) / sd
    var p = 1 - zProb(z)
    pField.value = Math.round(p * 10000) / 10000
  }
  else if (document.form1.area[2].checked) {
    ll = parseFloat(document.getElementById("ll").value)
    ul = parseFloat(document.getElementById("ul").value)
    z1 = (ll - M) / sd
    z2 = (ul - M) / sd
    zp = zProb(z2) - zProb(z1)
    pField.value = Math.round(zp * 10000) / 10000
  }
  else if (document.form1.area[3].checked) {
    tail = true
    ll = parseFloat(document.getElementById("oll").value)
    ul = parseFloat(document.getElementById("oul").value)
    z1 = (ll - M) / sd
    z2 = (ul - M) / sd
    zp = zProb(z1) + (1 - zProb(z2))
    pField.value = Math.round(zp * 10000) / 10000
  }
  if (sd <= 0) return
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, w, h)
  drawNormal(ctx, box, M, sd, ll, ul, tail) //canvas, bounds, mean, standard deviation, lower limit, upper limit, tail (outside or inside)
}
function inverse() {
  clearFields()
  var ll, ul, x1, x2
  var M = parseFloat(document.getElementById("meanInverse").value)
  var sd = parseFloat(document.getElementById("sdInverse").value)
  ctx.clearRect(0, 0, w, h)
  tail = false
  var p = parseFloat(document.getElementById("pInverse").value)
  var x1 = zinv(p)
  x1 = M + sd * x1
  if (document.form1.areaInverse[0].checked) {
    x1 = zinv(p)
    x1 = -M + sd * x1
    ul = M + 3.1 * sd
    ll = -x1
    drawNormal(ctx, box, M, sd, ll, ul, tail)
    ll = Math.round(1000 * ll) / 1000
    document.getElementById("aboveInverse").value = ll
  }
  else if (document.form1.areaInverse[1].checked) {
    ll = M - 3.1 * sd
    ul = x1
    drawNormal(ctx, box, M, sd, ll, ul, tail)
    ul = Math.round(1000 * ul) / 1000
    document.getElementById("belowInverse").value = ul
  }
  else if (document.form1.areaInverse[2].checked) {
    var p2 = p / 2
    x1 = zinv(.5 - p2)
    ll = x1
    ul = -x1
    ll = Math.round((M + sd * ll) * 1000) / 1000
    ul = Math.round((M + sd * ul) * 1000) / 1000
    drawNormal(ctx, box, M, sd, ll, ul, tail)
    document.getElementById("betweenInverse").value = ll + " [x] " + ul
  }
  else if (document.form1.areaInverse[3].checked) {
    /*var p2=p/2
    x1=zinv(p2)
    ll=x1
    ul=-x1
    drawNormal(ctx,box,M,sd,ll,ul,true)
    */
    var p2 = p / 2
    x1 = zinv(p2)
    ll = x1
    ul = -x1
    ll = Math.round((M + sd * ll) * 1000) / 1000
    ul = Math.round((M + sd * ul) * 1000) / 1000
    drawNormal(ctx, box, M, sd, ll, ul, true)
    document.getElementById("outsideInverse").value = ll + " ]x[ " + ul
  }
}
function drawNormal(ctx, box, M, sd, lFill, hFill, tail) {
  ctx.beginPath()
  var w = box.x2 - box.x1
  var h = box.y2 - box.y1
  //ctx.fillRect(b.x1,b.y1,w,h)
  var v = sd * sd
  var constant = 1 / Math.sqrt(2 * Math.PI * v)
  var x = M
  var maxDensity = constant
  var r = linTran(0, 1.1 * maxDensity, h, box.y1)
  var Ay = r[0]
  var by = r[1]
  var lowX = M - 3.5 * sd
  var highX = M + 3.5 * sd
  var r = linTran(lowX, highX, box.x1, box.x2)
  var Ax = r[0]; var bx = r[1]
  var x0 = lowX * bx + Ax
  var xf = highX * bx + Ax
  ctx.moveTo(xf, Ay)
  ctx.lineTo(x0, Ay)
  var inc = 1 / bx
  var dmax = 0
  for (var i = lowX; i <= highX; i += inc * .5) {
    xp = bx * i + Ax
    d = constant * Math.exp(-Math.pow((i - M), 2) / (2 * v))
    dmax = Math.max(dmax, d)
    dp = by * d + Ay
    //height in pixels
    ctx.lineTo(xp, dp)
    if (tail) {
      if (i >= hFill || i <= lFill) {
        ctx.moveTo(xp, Ay)
        ctx.lineTo(xp, dp + 1)
      }
    }
    else
      if (i <= hFill && i >= lFill) {
        ctx.moveTo(xp, Ay)
        ctx.lineTo(xp, dp + 1)
      }
  }
  ctx.textAlign = "center";
  ctx.font = "14px Courier sans-serif";
  ctx.strokeStyle = "blue"
  y = Ay + 15
  ctx.fillStyle = "black";
  for (var i = M - 3 * sd; i <= M + 3 * sd; i += sd) {
    x = bx * i + Ax
    ctx.moveTo(x, Ay)
    ctx.lineTo(x, Ay + 4)
    var xlab = Math.round(1000 * i)
    xlab = xlab / 1000
    ctx.fillText(xlab, x, y + 2);
  }
  ctx.stroke();
  //ctx.closePath()
}
init();
draw2();