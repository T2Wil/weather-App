import React, { Component } from 'react';
import '../assets/styles/App.css';
import getWeather from '../helpers/getWeather';
import toFahrenheit from '../helpers/toFahrenheit';
class App extends Component {
	constructor(props) {
		super(props);
		this.setPosition = this.setPosition.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.changeUnit = this.changeUnit.bind(this);
		this.state = {
			position: {
				latitude: '',
				longitude: '',
			},
			location: {
				country: '',
				name: '',
				weather: '',
				temperature: '',
				icon: '',
			},
			unit: 'C',
			error: '',
		};
	}
	async setPosition(position) {
		const { latitude, longitude } = position.coords;
		this.setState((prevState) => ({
			...prevState,
			position: {
				latitude,
				longitude,
			},
		}));
	}
	async setLocation() {
		const data = await getWeather(this.state.position);
		if (!data) {
			this.setState((prevState) => {
				return {
					...prevState,
					error: 'Failure of API call',
				};
			});
			return;
		}
		this.setState((prevState) => {
			return {
				...prevState,
				error: false,
				location: {
					country: data.sys.country,
					name: data.name,
					weather: data.weather[0].main,
					temperature: data.main.temp,
					icon: data.weather[0].icon,
				},
			};
		});
	}
	changeUnit() {
		this.setState((prevState) => {
			return {
				...prevState,
				unit: prevState.unit === 'C' ? 'F' : 'C',
			};
		});
	}

	render() {
		const { name, country, weather, icon, temperature } = this.state.location;
		const { unit, error } = this.state;
		const Geolocation = navigator.geolocation;
		if (Geolocation) {
			Geolocation.getCurrentPosition(
				this.setPosition,
				this.getPositionErrorCallback
			);
			this.setLocation();
    } else {
      this.setState((prevState) => {
				return {
					...prevState,
					error: 'Geolocation is not supported by your browser',
				};
			});
    }

		return (
			<div className='box position__center'>
				<header>Weather App</header>
				<div className={error ? 'show' : 'hide'}>
					{error}
				</div>
				<div className={error ? 'hide' : 'show'}>
					<div>
						<span>{name}</span> |<span>{country}</span>
					</div>
					<span>{weather}</span>
					<img src={icon} alt='image_not_found'></img>
					<span className={unit === 'C' ? 'show size--big' : 'hide'}>{`${temperature} ${unit}`}</span>
					<span className={unit === 'F' ? 'show size--big' : 'hide'}>
          {`${toFahrenheit(temperature)} ${unit}`}
					</span>
				</div>
					<button className='btn' onClick={this.changeUnit}>
						Change unit to {unit === 'F' ? '°C' : '°F'}
					</button>
			</div>
		);
	}
}

export default App;
