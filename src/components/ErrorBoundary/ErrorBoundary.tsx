import React, { ErrorInfo, ReactNode } from "react";
import styles from "./ErrorBoundary.module.scss";
import { ExternalLink } from "../Links/ExternalLink";

interface ErrorBoundaryProps {
	children?: ReactNode;
}

interface ErrorBoundaryState {
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(
			"Error caught by ErrorBoundary component: ",
			error,
			errorInfo,
		);
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
							<ExternalLink
								to="https://memorizescripture.org/contact"
								className={styles.Link}
							>
								Submit a bug report
							</ExternalLink>
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
