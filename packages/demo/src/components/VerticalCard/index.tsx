import style from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { DEMO } from '@/types';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
interface IProps {
	info: DEMO;
}
export const VerticalCard = ({ info }: IProps) => {
	const navigate = useNavigate();
	const onClick = (path: string) => {
		const _path = (qiankunWindow.__POWERED_BY_QIANKUN__ ? '/demo' : '') + path;
		console.log(_path);
		navigate(_path, {});
	};
	return (
		<article className={style.article_box}>
			{info.pre_img ? (
				<div
					onClick={() => onClick(info.path)}
					className={style.p_img_box}>
					<LazyLoad
						once={true}
						offset={100}
						height={'6rem'}>
						<img src={(qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? '') + info.pre_img} />
					</LazyLoad>
				</div>
			) : null}
			<div className={style.article_info}>
				<div className={style.body}>
					<h3 onClick={() => onClick(info.path)}>{info.name}</h3>
					{info.dec ? (
						<div className={style.dec_box}>
							<div className={style.dec}>{info.dec}</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</article>
	);
};
