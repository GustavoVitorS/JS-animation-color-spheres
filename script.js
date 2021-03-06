var c = document.getElementById('canv');
var $ = c.getContext('2d');
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var orbit;
var pov = 400;
var oy = -25;
var ox = 4.98;
var prevX = false;
var prevY = false;
var dx = 0;
var dy = 0;
var op = 0;
var ax = [];
var ay = [];
var az = [];
var as = [];
var ao = [];

set();
function set() {
  depth();
  $.translate(w / 2, h / 2);
  draw();
}

function draw() {
  $.clearRect(-w, -h, w * 2, h * 2);
  oy -= 0.03;
  if (ox > 1) ox = 1;
  else if (ox < 0.5) ox = 0.5;
  if (oy < -Math.PI * 2 * 2) {
    oy = 0;
    op += 3;
    if (op > 3) op = 0;
  } else if (oy > 0) {
    oy = -Math.PI * 2 * 2;
    op -= 3;
    if (op < 0) op = 3;
  }
  var sz = 0;
  var oz = 1;
  var x, y, z, xy, xz, yx, yz, zx, zy, sc;
  var o;
  var i = orbit;
  var arr = [];
  while (i--) {
    x = ax[i];
    y = ay[i];
    z = az[i];
    yz = Math.cos(oy) * z - Math.sin(oy) * x;
    yx = Math.sin(oy) * z + Math.cos(oy) * x;
    xy = Math.cos(ox) * y - Math.sin(ox) * yz;
    xz = Math.sin(ox) * y + Math.cos(ox) * yz;
    zx = yx;
    zy = xy;
    sc = pov / (pov + yz);
    x = zx * sc;
    y = zy * sc;
    z = yz;

    var zpos = Math.round(1500 * sc);
    if (!arr[zpos]) arr[zpos] = [];
    if (i < oy * -200) o = op + 3;
    else if (i < oy * -400) o = op + 2;
    else o = op + 1;
    arr[zpos].push([x, y, sc * as[i], o]);
  }
  var j = 0;
  var o_;
  var o = arr.length;
  while (i < o) {
    if (arr[i]) {
      j = arr[i].length;
      while (j--) {
        o_ = arr[i][j];
        $.save();
        $.translate(o_[0], o_[1]);
        $.scale(o_[2], o_[2]);
        syst(o_[3]);
        $.restore();
      }
    }
    i++;
  }
  window.requestAnimationFrame(draw);
}

function syst(o) {
  var g = $.createRadialGradient(o, o, 1, o, o, 20);
  g.addColorStop(0, 'hsla(98, 95%, 65%, 1)');
  g.addColorStop(0.5, 'hsla(68, 95%, 55%, .8)');
  g.addColorStop(0.8, 'hsla(288, 95%, 55%, .6)');
  g.addColorStop(1, 'hsla(0, 0%,0%,0)');
  var g1 = $.createRadialGradient(o, o, 1, o, o, 25);
  g1.addColorStop(0, 'hsla(288, 95%, 55%, 1)');
  g1.addColorStop(0.5, 'hsla(331, 95%, 55%, .8)');
  g1.addColorStop(0.8, 'hsla(62, 95%, 65%, 1)');
  g1.addColorStop(1, 'hsla(0, 0%,0%,0)');
  var g2 = $.createRadialGradient(o, o, 1, o, o, 25);
  g2.addColorStop(0, 'hsla(199, 95%, 45%, 1)');
  g2.addColorStop(0.5, 'hsla(331, 95%, 55%, .8)');
  g2.addColorStop(0.8, 'hsla(62, 95%, 65%, 1)');
  g1.addColorStop(1, 'hsla(0, 0%,0%,0)');
  if (o == 2 || c == 3) {
    $.globalAlpha = 0.01;
    orb(15);
    orb(10);
    orb(5);
  } else {
    $.fillStyle = g;
    $.globalAlpha = 0.1;
    orb(10);
  }
  if (o == 2 || o == 3) $.fillStyle = g;
  else if (o == 1 || o == 4) $.fillStyle = g2;
  else if (o == 0 || o == 5) $.fillStyle = g1;
  $.globalAlpha = 0.8;
  orb(4);
}
function orb(r) {
  $.beginPath();
  $.arc(0, 0, r, 0, Math.PI * 2);
  $.fill();
}

function depth() {
  var x, y, z, s;
  var i = 350;
  var o = 0;
  while (i--) {
    ax.push(19500 * Math.cos(i * 0.8) / (i + 100) - 5 + Math.random() * 10);
    ay.push(-175 + -20 + Math.round(Math.random() * 20 * 2));
    az.push(19500 * Math.sin(i * 0.8) / (i + 100) - 5 + Math.random() * 10);
    as.push(0.85 + Math.random() * 0.3);
    ao.push(1)
  }
  orbit = ax.length;
}
function mv(x, y) {
  dx = (prevX - x);
  dy = (prevY - y);
  dx *= 0.5;
  dy *= 0.5;
  ox -= dy / 50;
  oy += dx / 50;
  prevX = x;
  prevY = y;
}

window.addEventListener('mousemove', function (e) {
  e.preventDefault();
  mv(e.pageX, e.pageY)
}, false);

window.addEventListener('touchmove', function (e) {
  e.preventDefault();
  mv(e.touches[0].pageX, e.touches[0].pageY);
}, false);

window.addEventListener('resize', function () {
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
  $.translate(w / 2, h / 2);
}, false);