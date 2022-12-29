import logo from '../../assets/img/logo.svg';
import githubLogo from '../../assets/img/github-white.svg';
import './App.scss';

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// PARCEL ZONES & FORMULAS
const parcelZones = ['a1', 'a2', 'a3', 'a4', 'm1'];
const parcelZonesFormulas = {
  a1: (pA) => 0.651 * (1 + ((pA / 728) ^ 2)),
  a2: (pA) => 1.293 * (1 + ((pA / 728) ^ 2)),
  a3: (pA) => 1.935 * (1 + ((pA / 728) ^ 2)),
  a4: (pA) => 2.577 * (1 + ((pA / 728) ^ 2)),
  m1: (pA) => 0.289 * (1 + ((pA / 452) ^ 2)),
};

// ROOF ANGLE FORMULAS
const angleFormulas = [
  (a) => 0.80, // 0-30
  (a) => 0.8 * (60 - a) / 30, // 31-59
  (a) => 0, // 60-90
];

// RETURNS SHAPED COEFFICIENT OF SNOW WEIGHT
const calculateRoofAngle = (a) => {
  if (a <= 30) {
    const func = angleFormulas[0];
    return func(a);
  }

  if (a >= 31 && a <= 59) {
    const func = angleFormulas[1];
    return func(a);
  }

  if (a >= 60) {
    const func = angleFormulas[2];
    return func(a);
  }
};

function App() {
  // PARCEL ZONE HANDLER
  const [parcelZone, setParcelZone] = useState(parcelZones[0]);
  const onParcelZoneChange = (zone) => setParcelZone(zone);

  // RESULT HANDLER
  const [result, setResult] = useState([0, 0]);
  const updateResult = (e) => {
    e.preventDefault();

    // FIRST CALCULATION
    const ce = e.target[0].value; // Ce (EXPOSURE COEFFICIENT)
    const ct = e.target[1].value; // Ct (THERMAL COEFFICIENT)
    const parcelAltitude = e.target[2].value; // PARCEL ALTITUDE (A)

    const parcelZoneFormula = parcelZonesFormulas[parcelZone];
    const result1 = parcelZoneFormula(parcelAltitude); // CHARACTERISTIC SNOW WEIGHT (Sk)

    // SECOND CALCULATION
    const roofAngle = e.target[8].value; // ROOF ANGLE (a)
    const shapedAngle = calculateRoofAngle(roofAngle); // SHAPED COEFFICIENT OF SNOW WEIGHT (µ)
    const result2 = shapedAngle * ce * ct * result1 // SNOW WEIGHT (s)

    // RESULTS
    setResult([result1, result2]);
  };

  const resetValues = () => {
    setResult([0, 0])
  };

  return (
    <div className='App'>
      {/* HEADER */}
      <header>
        <div className='logo'>
          <img src={logo} alt='logo' />
        </div>
        <div className='title'>
          <h3>Snow Calculator</h3>
        </div>
      </header>

      {/* FORM */}
      <Form onSubmit={updateResult}>
        {/* EXPOSURE & THERMAL COEFFICIENTS (type: number, default: 1) */}
        <Form.Label htmlFor='exposureCoef'>Exposure & Thermal Coefficients</Form.Label>
        <InputGroup className='mb-3'>
          <InputGroup.Text>Ce</InputGroup.Text>
          <Form.Control id='exposureCoef' type='number' min={1} step={1} defaultValue={1} placeholder='1' />
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroup.Text>Ct</InputGroup.Text>
          <Form.Control id='thermalCoef' type='number' min={1} step={1} defaultValue={1} placeholder='1' />
        </InputGroup>

        {/* PARCEL ALTITUDE (type: number, default: 1) */}
        <InputGroup className='mb-3'>
          <InputGroup.Text>Parcel Altitude</InputGroup.Text>
          <Form.Control id='parcelAltitude' type='number' min={1} step={1} defaultValue={1} placeholder='1' />
          <InputGroup.Text>meters</InputGroup.Text>
        </InputGroup>

        {/* PARCEL ZONE (type: checkboxes, default: A1) */}
        <Form.Label htmlFor='parcelZones'>Parcel Zone</Form.Label>
        <InputGroup className='mb-3 d-grid'>
          <ToggleButtonGroup type='radio' name='parcelZones' id='parcelZones' value={parcelZone} onChange={onParcelZoneChange}>
            {parcelZones.map((zone, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${zone}`}
                name={`radio-${zone}`}
                type='radio'
                value={zone}
                variant='secondary'
              >
                {zone.toUpperCase()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </InputGroup>

        {/* ROOF ANGLE (type: number, default: 1) */}
        <InputGroup className='mb-3'>
          <InputGroup.Text>Roof Angle</InputGroup.Text>
          <Form.Control id='roofAngle' type='number' min={0} max={90} step={1} defaultValue={30} placeholder='1' />
          <InputGroup.Text>degrees (°)</InputGroup.Text>
        </InputGroup>

        {/* RESULTS */}
        <div className='mt-5'>
          <Form.Label htmlFor='result'>Results</Form.Label>
          <Form.Group className='mb-3 d-grid gap-2' controlId='result'>
            {/* RESULT 1 (CHARACTERISTIC SNOW WEIGHT) */}
            <InputGroup>
              <InputGroup.Text>Characteristic Snow Weight (Sk)</InputGroup.Text>
              <Form.Control size='lg' type='text' value={result[0]} readOnly />
            </InputGroup>

            {/* RESULT 2 (SNOW WEIGHT) */}
            <InputGroup>
              <InputGroup.Text>Snow Weight (s)</InputGroup.Text>
              <Form.Control size='lg' type='text' value={result[1]} readOnly />
            </InputGroup>
          </Form.Group>

          <Form.Group className='d-grid gap-2'>
            <Button variant='primary' size='lg' type='submit'>
              Generate Result
            </Button>
            <Button variant='secondary' size='lg' onClick={resetValues} type='reset'>
              Reset Values
            </Button>
          </Form.Group>
        </div>
      </Form>

      {/* FOOTER */}
      <footer className='mt-5'>
        <div>
          <p>Made by <a href='https://github.com/djebzer/' target='_blank' rel='noreferrer'>djebzer</a></p>
        </div>
        <div>
          <p>See on&nbsp;
            <a href='https://github.com/djebzer/snow-calculator/' target='_blank' rel='noreferrer'>
              GitHub
            </a>
            <img className='github-logo' src={githubLogo} alt='GitHub logo' />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;