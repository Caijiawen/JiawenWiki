import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '💎 Wealth',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        学习投资策略、资产配置和财富管理，通过科学的理财方法实现长期财富增长。
        涵盖数字货币、DeFi、传统投资和风险管理。
      </>
    ),
    link: '/docs/wealth',
  },
  {
    title: '📢 Influence',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        通过社交媒体和内容创作建立个人品牌，Learning in Public 实践，
        将知识和经验转化为影响力和价值。
      </>
    ),
    link: '/docs/influence',
  },
  {
    title: '🛠️ Build',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        从想法到产品，从产品到收入。记录完整的创业历程，分享产品开发、
        用户获取和商业变现的实战经验。
      </>
    ),
    link: '/docs/build',
  },
  {
    title: '💪 Health',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        通过科学的运动、饮食、睡眠和生活习惯，打造健康的身心状态。
        分享实用的健康管理方法和生活优化技巧。
      </>
    ),
    link: '/docs/health',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--6 col--lg--3')}>
      <Link to={link} className={styles.featureLink}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
