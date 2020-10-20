import React, { useState } from 'react';

//App
import './App.scss';

//Config
import { firebaseConfig } from './utilities/config';

//Firebase Config
import * as firebase from 'firebase/app';
import 'firebase/analytics';

import { BrowserRouter as Router, Route } from 'react-router-dom';

//Custom components
import { Menu } from './components/Menu/Menu';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Transition } from './components/Transition/Transition';

//Pages
import { Home } from './components/Home/Home';

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);

export default function App() {
	//state
	const [menuOpen, setMenuOpen] = useState(false);

	const handleMenuOpen = () => {
		console.log('Menu clicked');
		setMenuOpen((prevState) => !prevState);
	};

	return (
		<div className='App'>
			<MenuButton handleClick={handleMenuOpen} menuOpen={menuOpen} />
			<Menu menuOpen={menuOpen} />
			<Transition menuOpen={menuOpen}>
				<Router>
					<Route path='/'>
						<Home menuOpen={menuOpen} analytics={analytics} />
					</Route>
				</Router>
			</Transition>
		</div>
	);
}
