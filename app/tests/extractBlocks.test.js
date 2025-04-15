const parseDxf = require('dxf-parser');
const fs = require('fs');

test('should parse DXF file and extract blocks', () => {
  const data = fs.readFileSync(`C:\Users\Lenovo\Downloads\test.dxf`, 'utf-8');
  const parser = new parseDxf();
  const dxf = parser.parseSync(data);

  expect(dxf.blocks).toBeDefined();
  expect(typeof dxf.blocks).toBe('object');
});
