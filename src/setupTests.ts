import '@testing-library/jest-dom';

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
	value: ResizeObserver
});
