import { CodeShow } from '../components/codeShow/CodeShow';
import WindowMessageString from '@demo/demo/hooks/WindowMessage?raw';
import useBCStateString from '@demo/hooks/useBCState?raw';
import WindowMessage from '@demo/demo/hooks/WindowMessage';

export default () => {
	return (
		<>
			<CodeShow
				sources={[
					{
						label: 'WindowMessage',
						value: WindowMessageString,
					},
					{
						label: 'useBCState',
						value: useBCStateString,
					},
				]}>
				<WindowMessage />
			</CodeShow>
		</>
	);
};
