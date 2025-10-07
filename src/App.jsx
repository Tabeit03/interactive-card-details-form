import React, {useState} from 'react'
import bgMobile from "./images/bg-main-mobile.png";
import bgDesktop from "./images/bg-main-desktop.png";
import logo from "./images/card-logo.svg";
import complete from "./images/icon-complete.svg"


export default function App() {
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState("");
  const [cvc, setCvc] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState({});

    // data validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Can't be blank";

    // Month validation
    if (!month.trim()) {
      newErrors.month = "Can't be blank";
    } else {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        newErrors.month = "Must be between 01-12";
      }
    }
    
    // Year validation
    if (!year.trim()) {
      newErrors.year = "Can't be blank";
    } else {
      const currentYear = new Date().getFullYear() % 100;
      const yearNum = parseInt(year, 10);
      if (yearNum < currentYear) {
        newErrors.year = "Card has expired";
      }
    }
// cvc and card num vaidation
    if (!cvc.trim()) newErrors.cvc = "Can't be blank";
    if (!cardNumber.trim()) newErrors.card = "Can't be blank";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setConfirmed(true);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters and spaces
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setName(value);
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleMonthChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setMonth(val);
    setErrors(prev => ({ ...prev, month: '' }));
  };

  const handleYearChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setYear(val);
    setErrors(prev => ({ ...prev, year: '' }));
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    setCvc(val);
    setErrors(prev => ({ ...prev, cvc: '' }));
  };

  const handleCardChange = (e) => {
    const inputVal = e.target.value;
    const hasInvalidChars = /[^0-9 ]/.test(inputVal);
    if (hasInvalidChars) {
      setErrors(prev => ({ ...prev, card: 'Wrong format, numbers only' }));
      return;
    }
    setErrors(prev => ({ ...prev, card: '' }));
   // Remove all spaces and format with spaces every 4 digits
    const digitsOnly = inputVal.replace(/\s/g, '');
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    // Only update if within limit
    if (digitsOnly.length <= 16) {
      setCardNumber(formatted);
    }
  };


  return (
    <>
    {/* background */}
    <section>
<div className='absolute -z-10 w-full h-full'>
  <picture>
    <source media="(min-width: 1024px)" srcSet= {bgDesktop} />
    <img src={bgMobile} alt="background" className='w-full lg:w-1/3'/>
  </picture>
</div>

 {/*frontcard */}
<div className='grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-7xl mx-auto'>
<div className='mt-20 mx-5 lg:grid grid-cols-1 '>
  <article className='Front-card p-5 flex flex-col justify-between'>
    <img src={logo} alt="logo" className='w-18 lg:w-30' /> 
    <div>
      <h2 className='text-white text-base lg:text-3xl mb-6 lg:mb-12 tracking-widest'> {cardNumber || '0000 0000 0000 0000'}</h2>
      <ul className='flex items-center justify-between'>
        <li className='text-white uppercase text-sm lg:text-xl tracking-widest'>{name || 'Jane Appleseed'}</li>
        <li className='text-white text-sm lg:text-xl tracking-widest'>{`${(month || '00').padStart(2, '0')}/ ${(year || '00').padStart(2, '0')}`}</li>
      </ul>
    </div>
</article>
{/* backcard  */}
<article className='Back-card relative ml-20 mt-8'> 
<p className='absolute right-12 text-sm text-white tracking-widest lg:text-xl'>{cvc.padStart(3, '0') || '000'}</p>
</article>
</div>

{/* form + thank you page */}
  <div className='pt-8 px-5 pb-20'>
{confirmed ? (
  <ThankYou setConfirmed={setConfirmed} />
    ):(
     <form onSubmit={handleSubmit} className='flex flex-col justify-center p-5 lg:h-screen gap-8 max-w-lg'>
      <div>
        <label htmlFor="cardholder_name">Cardholder Name</label>
        <input type="text" 
        name='cardholder_name'
        id='cardholder_name'
        placeholder='e.g Jane Appleseed'
        value={name}
        onChange={handleNameChange}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="card_number">Card Number</label>
        <input type="text"
        name='card_number'
        id='card_number'
        placeholder='e.g 1234 5678 9123 0000'
        maxLength={19}
        value={cardNumber}
        onChange={handleCardChange}
        />
        {errors.card && <p className="text-red-500 text-sm mt-1">{errors.card}</p>}
      </div>
     <article className='flex items-center justify-between gap-6'>
       <div className='flex-1'>
        <label htmlFor="month">EXP. DATE(MM/YY)</label>
        <div className='flex gap-3'>
          <input 
            type="text"
            name='month'
            id='month'
            placeholder='MM'
            maxLength={2}
            value={month}
            onChange={handleMonthChange}
            className='flex-1'
          />
          <input 
            type="text"
            name='year'
            id='year'
            placeholder='YY'
            maxLength={2}
            value={year}
            onChange={handleYearChange}
            className='flex-1'
          />
        </div>
        {(errors.month || errors.year) && <p className="text-red-500 text-sm mt-1">{errors.month || errors.year}</p>}
      </div> 
      <div className='flex-1'>
        <label htmlFor="cvc">CVC</label>
        <input type="text"
        name='cvc'
        id='cvc'
        placeholder='e.g 123'
        maxLength={3} 
        value={cvc}
        onChange={handleCvcChange}
        />
        {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
      </div>
     </article>
     
     <article>
      <button type="submit" className='btn'>Confirm</button>
     </article>
    </form> 
)}
  </div>
</div>
    </section>
    </>
  )
}

function ThankYou ({setConfirmed}) {
return (
<>
<div className='flex flex-col items-center mt-80 md:mt-0 justify-center lg:h-screen max-w-lg mx-auto'>
<img src={complete} alt="complete" className='block mx-auto mb-8' />
<h1 className='text-slate-800 text-3xl mb-6 uppercase text-center'>Thank You</h1>
<p className='text-slate-400 text-center'>We've added your card details</p>
<button type="button" onClick={() => setConfirmed(false)} className='btn block mx-auto mt-10'>Continue</button>
</div>
</>
)

}