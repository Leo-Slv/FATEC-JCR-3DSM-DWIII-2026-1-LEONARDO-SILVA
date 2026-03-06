function isInteger(val) {
  if (val === undefined || val === null || val === '') return false;
  const n = Number(val);
  return Number.isInteger(n) && n > 0;
}

function stringPreenchida(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function emailBasico(val) {
  if (!stringPreenchida(val)) return false;
  return val.includes('@') && val.includes('.');
}

module.exports = { isInteger, stringPreenchida, emailBasico };
