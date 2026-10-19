import { getPhasePage, paras } from './phase';

/**
 * Control page — WordPress page with slug CONTROL_PAGE_SLUG (default "control"),
 * ACF field group "Control Page". Empty fields fall back to the text below (from Figma).
 */

export const CONTROL_DEFAULTS = {
  title: 'Control',
  hero: {
    breadcrumb: 'TechChoice / Control',
    title: ['Control: Because “It’s Live” Is Not the Same as “It’s Handled”'],
    lead: 'Ongoing oversight so your strategy doesn’t quietly rot the second everyone stops watching.',
    image: '/images/control/control-hero.jpg',
    foot: 'Independent thinking. Accountable execution.',
  },
  problem: {
    label: '01 / The problem we solve',
    title: ['Go-live is not', 'the finish line.'],
    body: paras(
      'Here’s the industry’s dirty secret: once the contract’s signed, vendors are counting on you to stop paying attention, and most advisors are counting on the same thing. Contracts auto-renew. Invoices get padded. Services you canceled eighteen months ago are somehow still showing up as a line item. But billing creep is only half the problem, and honestly the easier half to catch. The bigger risk is quieter: your strategic goals keep evolving, the market keeps shifting underneath you, and nobody’s checking whether the solution you signed off on two years ago is still the right one for where your business is headed now. Control is our answer to both. We don’t disappear after go-live, and we don’t just audit invoices. We stay close to your strategy, keep you ahead of what’s changing across the industry, and make sure you’re never the last one in the room to find out something affects your business.'
    ),
  },
  included: {
    label: '02 / What’s included',
    title: 'Here’s What Control Actually Looks Like',
    items: [
      { icon: 'receipt', title: 'Invoice & Billing Audits', text: 'Catching the overcharges, duplicate billing, and contract violations vendors are betting you’ll never notice.' },
      { icon: 'etm', title: 'Enterprise Technology Management (ETM)', text: 'Full visibility into every service, every dollar, across your entire environment.' },
      { icon: 'calendar_range', title: 'Contract Lifecycle Management', text: 'Renewal dates, escalation clauses, and termination windows tracked so you’re never blindsided by an auto-renewal you forgot existed.' },
      { icon: 'badge', title: 'SLA Enforcement', text: 'Holding vendors to the performance they promised, not the performance they’d prefer you forgot about.' },
      { icon: 'sliders', title: 'Continuous Optimization', text: 'As your business evolves, we adjust the stack with it instead of letting it fossilize into whatever was “good enough” three years ago.' },
      { icon: 'calendar_check', title: 'Annual Technology Reviews', text: 'Once a year, we sit down with you and formally present how your current solution stacks up against a marketplace that hasn’t stood still. If it’s still the right fit, we’ll say so. If it’s not going to deliver on the strategy it was built for anymore, we’ll be the first ones to tell you, not the last.' },
    ],
  },
  value: {
    label: '03 / The value',
    title: 'Why this matters.',
    body: paras(
      'Most advisory relationships end the day the deal closes, which is exactly the day vendors start counting on your attention moving elsewhere. Ours doesn’t end there. Control is how we make sure that bet never pays off, month after month, year after year.'
    ),
    cycle: {
      label: 'Continuous oversight',
      steps: [
        { title: 'Audit', text: 'Verify invoices and performance.' },
        { title: 'Enforce', text: 'Hold suppliers to their commitments.' },
        { title: 'Optimize', text: 'Improve cost and performance.' },
        { title: 'Review', text: 'Keep strategy under review.' },
      ],
      foot: 'Strategy stays under review. Always.',
    },
    button_label: 'Put Control to Work',
    button_url: '/contact',
  },
};

export const getControlPage = () => getPhasePage(process.env.CONTROL_PAGE_SLUG || 'control', CONTROL_DEFAULTS);
