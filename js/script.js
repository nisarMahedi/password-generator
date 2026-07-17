
const lengthRange = document.getElementById('lengthRange');
const lengthValue = document.getElementById('lengthValue');
const generateBtn = document.getElementById('generateBtn');
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const copyTooltip = document.getElementById('copyTooltip');

const choiceScreen = document.getElementById('choiceScreen');
const customForm = document.getElementById('customForm');
const outputSection = document.getElementById('outputSection');
const suggestBtn = document.getElementById('suggestBtn');
const chooseOwnBtn = document.getElementById('chooseOwnBtn');
const startOverBtn = document.getElementById('startOverBtn');

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}';

lengthRange.addEventListener('input', () => {
  lengthValue.textContent = lengthRange.value;
});

function buildPassword(length, sets) {
  const allChars = sets.join('');
  let password = '';

  // guarantee at least one char from each selected set
  sets.forEach(set => {
    password += set[Math.floor(Math.random() * set.length)];
  });

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('').slice(0, length);
}

function calculateStrength(password, useUpper, useLower, useNumbers, useSymbols) {
  const varietyCount = [useUpper, useLower, useNumbers, useSymbols].filter(Boolean).length;
  const length = password.length;

  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (length >= 16) score++;
  score += varietyCount - 1; // 0 to 3 extra points

  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  if (score <= 5) return 'strong';
  return 'verystrong';
}

function updateStrengthUI(level) {
  const wrap = document.getElementById('strengthWrap');
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');

  wrap.classList.remove('strength-weak', 'strength-medium', 'strength-strong', 'strength-verystrong');

  const labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong', verystrong: 'Very strong' };
  const widths = { weak: '25%', medium: '55%', strong: '80%', verystrong: '100%' };

  wrap.classList.add('strength-' + level);
  fill.style.width = widths[level];
  text.textContent = labels[level];
}

function showPassword(password, useUpper, useLower, useNumbers, useSymbols) {
  passwordOutput.value = password;
  resetCopyState();
  outputSection.classList.add('visible');

  const level = calculateStrength(password, useUpper, useLower, useNumbers, useSymbols);
  updateStrengthUI(level);
}

// Option 1: system-suggested strong password (average length, all character types)
suggestBtn.addEventListener('click', () => {
  choiceScreen.style.display = 'none';
  customForm.style.display = 'none';

  const AVERAGE_LENGTH = 14;
  const sets = [UPPER, LOWER, NUMBERS, SYMBOLS];
  const password = buildPassword(AVERAGE_LENGTH, sets);

  showPassword(password, true, true, true, true);
});

// Option 2: user builds their own
chooseOwnBtn.addEventListener('click', () => {
  choiceScreen.style.display = 'none';
  customForm.style.display = 'block';
});

function generatePassword() {
  const length = parseInt(lengthRange.value, 10);
  const useUpper = document.getElementById('uppercase').checked;
  const useLower = document.getElementById('lowercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;

  const sets = [];
  if (useUpper) sets.push(UPPER);
  if (useLower) sets.push(LOWER);
  if (useNumbers) sets.push(NUMBERS);
  if (useSymbols) sets.push(SYMBOLS);

  if (sets.length === 0) {
    outputSection.classList.remove('visible');
    alert('Please select at least one character type.');
    return;
  }

  const password = buildPassword(length, sets);
  showPassword(password, useUpper, useLower, useNumbers, useSymbols);
}

function resetCopyState() {
  copyBtn.classList.remove('copied');
  copyTooltip.textContent = 'Copy to clipboard';
}

generateBtn.addEventListener('click', generatePassword);

startOverBtn.addEventListener('click', () => {
  outputSection.classList.remove('visible');
  customForm.style.display = 'none';
  choiceScreen.style.display = 'block';
  passwordOutput.value = '';
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(passwordOutput.value);
  } catch (err) {
    passwordOutput.select();
    document.execCommand('copy');
  }

  copyBtn.classList.add('copied');
  copyTooltip.textContent = 'Copied!';
  copyTooltip.classList.add('show');

  setTimeout(() => {
    copyTooltip.classList.remove('show');
  }, 1200);

  setTimeout(() => {
    resetCopyState();
  }, 1800);
});

copyBtn.addEventListener('mouseenter', () => {
  if (!copyBtn.classList.contains('copied')) copyTooltip.classList.add('show');
});
copyBtn.addEventListener('mouseleave', () => {
  copyTooltip.classList.remove('show');
});