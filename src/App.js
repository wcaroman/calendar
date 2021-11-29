import './App.css'
import React from 'react'
// import ReactDOM from 'react-dom'

function App() {
	
	const data = {
		"mo": [ { "bt": 240, "et": 779 }],
		"tu": [ ],
		"we": [ ],
		"th": [
			{ "bt": 240, "et": 779 },
			{ "bt": 1140, "et": 1319 }
		],
		"fr": [ { "bt": 660, "et": 1019 }],
		"sa": [{ "bt": 0, "et": 1439 }],
		"su": []
	}
	
	const convertedData = {}
	for (const day in data) {
		convertedData[day] = []
		for (let i = 0; i < 24; i++) {
			if (data[day].length) {
				convertedData[day][i] = false 
				for (const arr of data[day]) {
					if ( (60*i + 30) > arr.bt && (60*i + 30) < arr.et )
						convertedData[day][i] = true
				}
			} else convertedData[day][i] = false
		}
	}
	
	const days = [
		{id: 0, name: 'mo', isPicked: false, isFullPicked: false},
		{id: 1, name: 'tu', isPicked: false, isFullPicked: false},
		{id: 2, name: 'we', isPicked: false, isFullPicked: false},
		{id: 3, name: 'th', isPicked: false, isFullPicked: false},
		{id: 4, name: 'fr', isPicked: false, isFullPicked: false},
		{id: 5, name: 'sa', isPicked: false, isFullPicked: false},
		{id: 6, name: 'su', isPicked: false, isFullPicked: false}
	]
	
	for (const day of days) {
		if (data[day.name].length) 
			days[day.id].isPicked = true
		if (data[day.name].length === 1 && data[day.name][0].bt === 0 && data[day.name][0].et === 1439) 
			days[day.id].isFullPicked = true
	}
	
	const [newDays, setDays] = React.useState( days )
	const [newConvertedData, setData] = React.useState( convertedData )
	const [mouseDown, setMouseDown] = React.useState(0)
	const [isSlotPicked, setIsSlotPicked] = React.useState()
	
	const mouseDownHandler = (day, time, isSlotPicked) => {
		setMouseDown(1)
		setIsSlotPicked(isSlotPicked)
		const tempData = { ...newConvertedData }
		tempData[day][time] = !tempData[day][time]
		setData( tempData )
		
		checkIfDayPicked(day, tempData)
	}
	
	const moveHandler = (day, time) => {
		const tempData = { ...newConvertedData }
		if (mouseDown === 1) {
			tempData[day][time] = !isSlotPicked
			setData( tempData )
		}
		
		checkIfDayPicked(day, tempData)
	}
	
	const checkIfDayPicked = (day, tempData) => {
		let isPicked = false,
			isFullPicked = false
		const slots = tempData[day].filter( i => i === true ).length
		if (slots > 0) isPicked = true
		if (slots === 24) isFullPicked = true
		
		setDays (
			newDays.map( obj => {
				if (obj.name === day) {
					obj.isPicked = isPicked
					obj.isFullPicked = isFullPicked
				}
				return obj
			})
		)
	}
	
	const allDayClick = (day, isFullPicked, i) => {
		const tempData = { ...newConvertedData }
		tempData[day] = tempData[day].map( () => !isFullPicked )
		setData( tempData )
		
		setDays( 
			newDays.map( obj => {
				if (obj.name === day) {
					obj.isFullPicked = !isFullPicked
					obj.isPicked = !isFullPicked
				}
				return obj
			})
		)
	}
	
	const clear = () => {
		const tempData = { ...newConvertedData }
		for (const day of Object.keys(data)) {
			for (let i=0; i < 24; i++) {
				tempData[day][i] = false
			}
		}
		setData( tempData )
		
		setDays( newDays.map( day => {
			day.isPicked = false
			day.isFullPicked = false
			return day
		} ) )
	}
	
	const save = () => {
		const newData = { mo: [], tu: [], we: [], th: [], fr: [], sa: [], su: [] }
		
		for (const day of Object.keys(data)) {
			for (let i=0, j=0; i < 24; i++) {
				if ( (i === 0 && newConvertedData[day][i] === true) || (newConvertedData[day][i] === true && newConvertedData[day][i-1] === false) ) {
					newData[day].push( { bt: i*60 } )
					j++
				}
				if ( (i === 23 && newConvertedData[day][i] === true) || (newConvertedData[day][i] === true && newConvertedData[day][i+1] === false) ) 
					newData[day][j-1].et = i*60+59
			}
		}
		
		console.log(newData)
	}
	
	
	return (
		<div className="wrapper" >
			<h1>SET SCHEDULE</h1>
			<header className="a">
				<div className="allDays">ALL<br/>DAY</div>
				{ [...Array(8)].map((e, i) => {
					return <div className="timeSegments" key={i}>{i<4&&0}{i*3}:00</div>
				}) }
			</header>
			<header className="b">
				<div className="beforeTicks"></div>
				{ [...Array(8)].map((e, i) => {
					return <div className="ticks" key={i}></div>
				}) }
			</header>
			{ newDays.map( (day, i) => {
				return (
					<div className="dayWrap" data-day={day.name} key={i}>
						<div className={newDays[i].isPicked ? 'day day-picked' : 'day'} >{day.name}</div>
						<div className="allDay" onClick={ () => allDayClick(day.name, newDays[i].isFullPicked, i) } >
							{ newDays[i].isFullPicked &&
								<>
									<div className="circle"></div>
									<div className="check"></div>
								</>
							}
						</div>
						
						{ [...Array(24)].map((e, i) => { // i=[0,23]
							return (
								<div 
									onMouseDown={ () => mouseDownHandler(day.name, i, newConvertedData[day.name][i]) }
									onMouseUp={ () => setMouseDown(0) }
									onMouseEnter={ () => moveHandler(day.name, i) }
									data-time={i} 
									className={newConvertedData[day.name][i] ? 'slot slot-picked' : 'slot'} 
									key={i}>
								</div>
							)
						}) }
						
					</div>
				)
			}) }
			
			<button onClick={ () => save() }>Save Changes</button>
			<button onClick={ () => clear() } >Clear</button>
			
		</div>
	)
}

export default App
