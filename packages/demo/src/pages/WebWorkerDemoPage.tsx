import { CodeShow } from '../components/codeShow/CodeShow';
import WebWorkerDemoString from '@demo/demo/hooks/WebWorkerDemo?raw';
import useWebWorkerString from '@demo/hooks/useWebWorker?raw';
import WebWorkerDemo from '@demo/demo/hooks/WebWorkerDemo';

export default () => {
	return (
		<>
			<CodeShow
				sources={[
					{
						label: 'WebWorkerDemo',
						value: WebWorkerDemoString,
					},
					{
						label: 'useWebWorker',
						value: useWebWorkerString,
					},
				]}>
				<WebWorkerDemo />
			</CodeShow>
		</>
	);
};
