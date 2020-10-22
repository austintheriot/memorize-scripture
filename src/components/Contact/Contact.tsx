import React, { useState } from 'react';
import styles from './Contact.module.scss';

//Material UI
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { FormHelperText } from '@material-ui/core';

import { emailAPIKey } from '../../utilities/config';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(0.25),
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	iconButton: {
		width: 'max-content',
	},
	label: {
		color: 'var(--light)',
		zIndex: 1,
		left: '0.6rem',
	},
	input: {
		padding: '1rem 1rem',
		backgroundColor: 'var(--dark)',
		color: 'var(--light)',
		fontSize: '1.1rem',
	},
}));

export const Contact = () => {
	const classes = useStyles();
	const [email, setEmail] = useState('');
	const [emailHasErrors, setEmailHasErrors] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [emailDisabled, setEmailDisabled] = useState(false);

	const [message, setMessage] = useState('');
	const [messageDisabled, setMessageDisabled] = useState(false);

	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [userMessage, setUserMessage] = useState('');

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: string
	) => {
		const value = e.currentTarget.value;
		if (type === 'email') setEmail(value);
		if (type === 'message') setMessage(value);
	};

	const handleBlur = () => {
		validateEmail();
	};

	const validateEmail = () => {
		if (
			!email.match(
				// eslint-disable-next-line no-control-regex
				/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
			)
		) {
			setEmailHasErrors(true);
			setEmailError('Invalid email');
			setUserMessage('Please provide a valid email before submitting.');
			return true;
		} else {
			setEmailHasErrors(false);
			setEmailError('');
			setUserMessage('');
			return false;
		}
	};

	const disableElements = (disable: boolean) => {
		setEmailDisabled(disable);
		setMessageDisabled(disable);
		setButtonDisabled(disable);
	};

	const clearInputs = () => {
		setEmail('');
		setMessage('');
	};

	const sendSubmission = async () => {
		const response = await fetch(
			'https://us-central1-austins-email-server.cloudfunctions.net/sendEmail/contactForm',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					Name: '',
					Email: email,
					Message: message,
					_private: {
						key: emailAPIKey,
					},
				}),
			}
		);
		return response.json();
	};

	const submit = () => {
		disableElements(true);
		setUserMessage('Sending message...');
		sendSubmission()
			.then((data) => {
				disableElements(false);
				if (data.error) {
					setUserMessage(
						'Sorry, there was an error processing your message. Please try again later.'
					);
				} else {
					console.log(data);
					clearInputs();
					setUserMessage('Your message was successfully received!');
				}
			})
			.catch((error) => {
				console.error(error);
				setUserMessage(
					'Sorry, there was an error processing your message. Please try again later.'
				);
			});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateEmail()) return;
		submit();
		console.log('Form submitted!');
	};

	return (
		<main>
			<form
				noValidate
				autoComplete='off'
				className={styles.root}
				onSubmit={handleSubmit}>
				<h1>Contact</h1>

				<FormControl className={classes.formControl}>
					<InputLabel
						id='email'
						className={classes.label}
						error={emailHasErrors}>
						Email*
					</InputLabel>
					<Input
						className={classes.input}
						fullWidth={true}
						id='outlined-multiline-static'
						disabled={emailDisabled}
						value={email}
						error={emailHasErrors}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleChange(e, 'email')
						}
						onBlur={handleBlur}
					/>
					<FormHelperText error={emailHasErrors}>{emailError}</FormHelperText>
				</FormControl>

				<FormControl className={classes.formControl}>
					<InputLabel id='bible-chapter' className={classes.label}>
						Message
					</InputLabel>
					<Input
						multiline={true}
						rows={4}
						className={classes.input}
						fullWidth={true}
						id='outlined-multiline-static'
						disabled={messageDisabled}
						value={message}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleChange(e, 'message')
						}
					/>
				</FormControl>

				<p className={styles.userMessage}>{userMessage}</p>
				<button
					disabled={buttonDisabled}
					className={[
						'button',
						styles.submit,
						buttonDisabled ? styles.disabled : '',
					].join(' ')}>
					Submit
				</button>
			</form>
		</main>
	);
};
