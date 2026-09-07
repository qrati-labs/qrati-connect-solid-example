/* @refresh reload */
import { render } from 'solid-js/web';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './index.css';
import App from './App.tsx';

const root = document.getElementById('root');

render(() => <App />, root!);
