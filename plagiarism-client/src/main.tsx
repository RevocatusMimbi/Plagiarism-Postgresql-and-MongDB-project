import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/toast';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/* Add the QueryClientProvider here */}
		<QueryClientProvider client={queryClient}>
			<ToastProvider>
				<App />
			</ToastProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
