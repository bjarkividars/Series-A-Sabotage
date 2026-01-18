'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';

interface OnboardingModalProps {
  open: boolean;
  onComplete: (startupName: string, fundingAmount: number) => void;
  initialName?: string;
  initialAmount?: number;
  isEditing?: boolean;
}

const TITLE_TEXT = 'Welcome to Series A Sabotage';
const SUBTITLE_TEXT = 'Every hire is a decision. Every decision is a mistake.';
const TYPING_SPEED = 60;
const SPACE_DELAY = 150;
const PERIOD_DELAY = 400;

export function OnboardingModal({
  open,
  onComplete,
  initialName = '',
  initialAmount = 0,
  isEditing = false,
}: OnboardingModalProps) {
  const [startupName, setStartupName] = useState(initialName);
  const [fundingAmount, setFundingAmount] = useState(
    initialAmount > 0 ? initialAmount.toLocaleString() : ''
  );
  const [errors, setErrors] = useState({ name: '', funding: '' });

  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showNameField, setShowNameField] = useState(false);
  const [showFundingField, setShowFundingField] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(isEditing);

  useEffect(() => {
    if (!open || isEditing) {
      setAnimationComplete(true);
      setShowNameField(true);
      setShowFundingField(true);
      setShowButton(true);
      return;
    }

    let titleIndex = 0;
    let subtitleIndex = 0;
    let titleTimeout: NodeJS.Timeout;
    let subtitleTimeout: NodeJS.Timeout;
    let nameFieldTimeout: NodeJS.Timeout;
    let fundingFieldTimeout: NodeJS.Timeout;
    let buttonTimeout: NodeJS.Timeout;

    const getDelay = (text: string, index: number): number => {
      if (index === 0) return TYPING_SPEED;
      const lastChar = text[index - 1];
      if (lastChar === '.') return PERIOD_DELAY;
      if (lastChar === ' ') return SPACE_DELAY;
      return TYPING_SPEED;
    };

    const typeTitle = () => {
      if (titleIndex < TITLE_TEXT.length) {
        setTitleText(TITLE_TEXT.slice(0, titleIndex + 1));
        titleIndex++;
        const delay = getDelay(TITLE_TEXT, titleIndex);
        titleTimeout = setTimeout(typeTitle, delay);
      } else {
        setTimeout(() => {
          typeSubtitle();
        }, 800);
      }
    };

    const typeSubtitle = () => {
      if (subtitleIndex < SUBTITLE_TEXT.length) {
        setSubtitleText(SUBTITLE_TEXT.slice(0, subtitleIndex + 1));
        subtitleIndex++;
        const delay = getDelay(SUBTITLE_TEXT, subtitleIndex);
        subtitleTimeout = setTimeout(typeSubtitle, delay);
      } else {
        nameFieldTimeout = setTimeout(() => {
          setShowNameField(true);
        }, 600);

        fundingFieldTimeout = setTimeout(() => {
          setShowFundingField(true);
        }, 1000);

        buttonTimeout = setTimeout(() => {
          setShowButton(true);
          setAnimationComplete(true);
        }, 1400);
      }
    };

    const startTimeout = setTimeout(() => {
      typeTitle();
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(titleTimeout);
      clearTimeout(subtitleTimeout);
      clearTimeout(nameFieldTimeout);
      clearTimeout(fundingFieldTimeout);
      clearTimeout(buttonTimeout);
    };
  }, [open, isEditing]);

  const formatNumberWithCommas = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) return '';

    return parseInt(digitsOnly, 10).toLocaleString();
  };

  const handleFundingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatNumberWithCommas(rawValue);
    setFundingAmount(formatted);
    setErrors(prev => ({ ...prev, funding: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', funding: '' };
    let isValid = true;

    if (!startupName.trim()) {
      newErrors.name = 'Startup name is required';
      isValid = false;
    }

    const rawAmount = fundingAmount.replace(/,/g, '');
    const amount = parseFloat(rawAmount);
    if (!rawAmount || isNaN(amount) || amount <= 0) {
      newErrors.funding = 'Valid funding amount is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const amount = parseFloat(fundingAmount.replace(/,/g, ''));
      onComplete(startupName.trim(), amount);
    }
  };

  const rawAmount = fundingAmount.replace(/,/g, '');
  const isFormValid = startupName.trim() !== '' && rawAmount !== '' && !isNaN(parseFloat(rawAmount)) && parseFloat(rawAmount) > 0;

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      <Dialog.Content
        className={isEditing ? "max-w-4xl! p-12!" : ""}
        title={isEditing ? 'Edit Startup Info' : ''}
        description={isEditing ? undefined : ''}
        showClose={isEditing}
        fullScreen={!isEditing}
      >
        <div className={!isEditing ? "max-w-4xl w-full mx-auto" : ""}>
          {!isEditing && (
            <div className="mb-12 min-h-[200px]">
              <h2 className="text-4xl md:text-6xl font-serif text-royal-blue mb-4">
                {titleText}
                {!animationComplete && titleText.length < TITLE_TEXT.length && (
                  <span className="animate-pulse">|</span>
                )}
              </h2>
              <p className="text-2xl md:text-3xl text-royal-blue/70 font-serif italic">
                {subtitleText}
                {!animationComplete &&
                  titleText.length === TITLE_TEXT.length &&
                  subtitleText.length < SUBTITLE_TEXT.length && (
                    <span className="animate-pulse">|</span>
                  )}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className={`transition-all duration-700 ${showNameField
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}>
              <label
                htmlFor="startup-name"
                className="block text-sm font-semibold text-royal-blue mb-3"
              >
                Startup Name
              </label>
              <input
                id="startup-name"
                type="text"
                value={startupName}
                onChange={(e) => {
                  setStartupName(e.target.value);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Enter your startup name"
                className="
                w-full
                text-5xl md:text-7xl
                font-serif
                text-royal-blue
                bg-transparent
                border-none
                outline-none
                placeholder:text-royal-blue/30
                focus:ring-0
                
              "
                autoFocus={animationComplete}
                required
                disabled={!animationComplete}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            <div className={`transition-all duration-700 ${showFundingField
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}>
              <label
                htmlFor="funding-amount"
                className="block text-sm font-semibold text-royal-blue mb-3"
              >
                Funding Amount
              </label>
              <div className="relative">
                <span className="absolute left-0 top-0 text-5xl md:text-7xl font-serif text-royal-blue py-4">
                  $
                </span>
                <input
                  id="funding-amount"
                  type="text"
                  inputMode="numeric"
                  value={fundingAmount}
                  onChange={handleFundingChange}
                  placeholder="10,000,000"
                  className="
                  w-full
                  text-5xl md:text-7xl
                  font-serif
                  text-royal-blue
                  bg-transparent
                  border-none
                  outline-none
                  placeholder:text-royal-blue/30
                  focus:ring-0
                  py-4
                  pl-10 md:pl-16
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
                  required
                  disabled={!animationComplete}
                />
              </div>
              {errors.funding && (
                <p className="text-red-600 text-sm mt-2">{errors.funding}</p>
              )}
            </div>

            <div className={`transition-all duration-700 ${showButton
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}>
              <button
                type="submit"
                disabled={!isFormValid}
                className="
                w-full
                bg-royal-blue
                text-highlight-yellow
                rounded-full
                py-6
                text-xl
                font-bold
                hover:scale-105
                transition-transform
                duration-300
                shadow-lg
                hover:shadow-xl
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
              >
                {isEditing ? 'Save Changes' : "Let's go"}
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
