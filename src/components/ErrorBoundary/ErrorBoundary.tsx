import React, { ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.scss';

interface Props {}

interface State {
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Catch errors in any child components and re-renders with an error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.error) {
			// Fallback UI if an error occurs
			return (
				<div className={styles.outerWrapper}>
					<div className={styles.innerWrapper}>
						<h2>Uh-oh! Something went wrong!</h2>
						<p>
							<a
								href='https://memorizescripture.org/contact'
								className={styles.Link}>
								Submit a bug report
							</a>
							, and I'll get the issue fixed as soon as possible. Thanks!
						</p>
					</div>
				</div>
			);
		}
		// component normally just renders children
		return this.props.children;
	}
}
