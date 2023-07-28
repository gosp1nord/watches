import { useEffect, useState } from "react";

interface ElementTemp {
  city: string
  deviation: string
}
interface ElementClock {
  id: string
  title: string
  indicator: string
  deviation: string
  onDel: React.MouseEventHandler<HTMLDivElement>
}
interface ElementsClocks {
  items: ElementClock[]
}
let arrClocks: ElementClock[] = []


export const ComponentClocks = () => {
  let [inputsData, setInputs] = useState<ElementTemp>({
    city: '',
    deviation: ''
  })
  const [clocks, setState] = useState<ElementsClocks>({items: []})

  useEffect(() => {
    const elementArray = clocks.items;
    if (elementArray.length) {
      changeIndicator();
    }
  }, [clocks])

  const changeIndicator = () => setTimeout(() => {
    arrClocks.forEach(item => {
      let strTime = createStrTime(item.deviation);
      item.indicator = strTime
    })
    setState({...clocks, items : arrClocks});
  }, 1000)
  
  const onDeleteClock = (e: React.MouseEvent) => {
    const elementParent = (e.target as HTMLElement).closest('.item-clock');
    if (elementParent) {
      arrClocks = arrClocks.filter(value => value.id !== elementParent.id);
      setState({...clocks, items: arrClocks})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setInputs({...inputsData, [name]: value});
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputsData.city) return;
    if (inputsData.deviation === '') {
      inputsData.deviation = '0'
    }
    let strTime = createStrTime(inputsData.deviation)
    arrClocks.push({id: String(Date.now()), title: inputsData.city, indicator: strTime, deviation: inputsData.deviation, onDel: onDeleteClock})
    setState({...clocks, items : arrClocks});
    inputsData.city = '';
    inputsData.deviation = '';
  }

  return (
    <>
    <form className='block-inputs' autoComplete="off" onSubmit={handleSubmit}>
      <input name="city" className='item-input' type="text" value={inputsData.city} onChange={handleChange} />
      <input name="deviation" className='item-input' type="number" value={inputsData.deviation} onChange={handleChange} />
      <button className="item-button">Добавить</button>
    </form>
    <div className='block-clocks'>
      <Clocks items={clocks.items}/>
    </div>
  </>
  )
}

const Clocks = ({items}: ElementsClocks) => {
  return (
    <>
    {items && items.map((item) => (
      <div key={item.id} id={item.id} className="item-clock">
        <div className="block-title">
          <div className="title-clock">{item.title}</div>
          <div className="line-numbers">{item.indicator}</div>
        </div>
        <div className="close-clock" onClick={item.onDel}>&#10007;</div>
      </div>
    ))}
    </>
  )
}

function createStrTime(timeIndicator: string) {
  const currentDate = new Date();
  const timeSet = new Date(Date.now() + (currentDate.getTimezoneOffset() * 60 * 1000) + (Number(timeIndicator) * 60 * 60 * 1000));

  let hour = String(timeSet.getHours());
  if (hour.length === 1) {
    hour = '0' + hour
  }
  let minutes = String(timeSet.getMinutes());
  if (minutes.length === 1) {
    minutes = '0' + minutes
  }
  let seconds = String(timeSet.getSeconds());
  if (seconds.length === 1) {
    seconds = '0' + seconds
  }
  return hour + ':' + minutes + ':' + seconds
}
