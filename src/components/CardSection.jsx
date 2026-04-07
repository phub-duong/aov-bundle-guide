'use client'

const cards = [
  {
    title: 'Getting Started',
    description: 'Install the app, explore the dashboard, and create your first bundle offer.',
    href: '/docs/getting-started',
  },
  {
    title: 'Offers',
    description: 'Create and manage Volume Discounts, FBT, Bundle Builder, Fixed Bundle, and Mix-and-Match offers.',
    href: '/docs/offers',
  },
  {
    title: 'Design',
    description: 'Customize widget appearance, colors, fonts, layouts, and auto-fit to your store theme.',
    href: '/docs/design',
  },
  {
    title: 'Analytics',
    description: 'Track offer performance with revenue, conversion, and trend charts.',
    href: '/docs/analytics',
  },
  {
    title: 'Settings',
    description: 'Configure app settings, manage your subscription plan, and adjust preferences.',
    href: '/docs/settings',
  },
]

export default function CardSection() {
  return (
    <div className="card-grid-3col" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.25rem',
      marginTop: '1.5rem',
    }}>
      {cards.map((card) => (
        <a
          key={card.title}
          href={card.href}
          style={{
            display: 'block',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            textDecoration: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
            overflow: 'hidden',
          }}
          className="doc-card"
        >
          <div style={{
            background: '#7EC8E3',
            height: '120px',
          }} />
          <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
            <h3 style={{
              margin: '0 0 0.375rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--card-title)',
              fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
            }}>
              {card.title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--card-desc)'
            }}>
              {card.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
