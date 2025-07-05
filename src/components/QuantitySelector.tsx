'use client';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (q: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
  max = 99,
  min = 1,
}: QuantitySelectorProps) {
  const increment = () => {
    if (quantity < max) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > min) setQuantity(quantity - 1);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-amber-400 bg-amber-50 shadow-sm">
      <button
        onClick={decrement}
        disabled={quantity <= min}
        className={`px-3 py-2 text-amber-700 font-bold text-lg rounded-l-lg hover:bg-amber-100 disabled:text-amber-300 disabled:cursor-not-allowed transition`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        className="w-14 text-center bg-transparent text-amber-900 font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
        value={quantity}
        min={min}
        max={max}
        onChange={(e) => {
          let val = Number(e.target.value);
          if (isNaN(val)) val = min;
          if (val > max) val = max;
          if (val < min) val = min;
          setQuantity(val);
        }}
        aria-label="Quantity input"
      />
      <button
        onClick={increment}
        disabled={quantity >= max}
        className={`px-3 py-2 text-amber-700 font-bold text-lg rounded-r-lg hover:bg-amber-100 disabled:text-amber-300 disabled:cursor-not-allowed transition`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
