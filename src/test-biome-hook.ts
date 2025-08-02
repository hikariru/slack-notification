// This file is for testing the pre-commit hook
// It should now pass Biome checks

function testBiomeHook() {
  const a = 1;
  const b = '1';

  // Fixed: Using triple equals instead of double equals
  if (a === Number(b)) {
    console.log('Equal');
  }
}

export default testBiomeHook;
