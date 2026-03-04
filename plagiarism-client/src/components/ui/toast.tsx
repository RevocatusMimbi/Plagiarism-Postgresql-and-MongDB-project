import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (message: string, type: ToastType) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: ToastType) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, message, type }]);

		// Auto-remove after 5 seconds
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 5000);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<ToastContainer
				toasts={toasts}
				removeToast={removeToast}
			/>
		</ToastContext.Provider>
	);
}

// Hook to use toast
export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

// Toast container component
function ToastContainer({
	toasts,
	removeToast,
}: {
	toasts: Toast[];
	removeToast: (id: string) => void;
}) {
	if (toasts.length === 0) return null;

	return (
		<div className='fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm'>
			{toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
}

// Individual toast item
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
	const bgColor = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		info: 'bg-blue-500',
		warning: 'bg-yellow-500',
	}[toast.type];

	return (
		<div
			className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3`}
			style={{
				animation: 'slideIn 0.3s ease-out',
			}}>
			<span className='text-sm font-medium'>{toast.message}</span>
			<button
				onClick={onClose}
				className='text-white hover:text-gray-200 transition-colors'
				aria-label='Close'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-4 w-4'
					viewBox='0 0 20 20'
					fill='currentColor'>
					<path
						fillRule='evenodd'
						d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
						clipRule='evenodd'
					/>
				</svg>
			</button>
		</div>
	);
}
