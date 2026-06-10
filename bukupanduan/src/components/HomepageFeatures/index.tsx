import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Monitoring Real-Time',
    Svg: require('@site/static/img/monitoring.svg').default,
    description: (
      <>
        Pantau status palang pintu, kereta api, dan kondisi sistem secara
        real-time melalui dashboard NeoGate.
      </>
    ),
  },
  {
    title: 'Kontrol Sistem IoT',
    Svg: require('@site/static/img/control.svg').default,
    description: (
      <>
        Kelola mode otomatis dan manual untuk memastikan sistem tetap berjalan
        dengan aman dan fleksibel.
      </>
    ),
  },
  {
    title: 'Riwayat Aktivitas',
    Svg: require('@site/static/img/logs.svg').default,
    description: (
      <>
        Semua aktivitas sistem tersimpan secara otomatis untuk kebutuhan
        monitoring dan evaluasi.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Fitur Utama NeoGate</h2>

        <div className={clsx('row', styles.centerRow)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}