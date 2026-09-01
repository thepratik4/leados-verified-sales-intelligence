import { runIntegrityTests } from '../lib/__tests__/integrity.test';

console.log('\n======================================================');
console.log('  LeadOS Verification & Data Integrity Test Suite');
console.log('======================================================\n');

const results = runIntegrityTests();

let allPassed = true;
results.forEach((r, idx) => {
  const icon = r.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${idx + 1}] ${r.test}`);
  if (r.details) {
    console.log(`    ↳ ${r.details}`);
  }
  if (!r.passed) {
    allPassed = false;
  }
});

console.log('\n------------------------------------------------------');
if (allPassed) {
  console.log(`🎉 ALL ${results.length} INTEGRITY TESTS PASSED SUCCESSFULLY!`);
} else {
  console.error('❌ SOME INTEGRITY TESTS FAILED');
  process.exit(1);
}
console.log('======================================================\n');
