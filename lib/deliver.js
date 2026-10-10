import { getPhasePage, paras } from './phase';

/**
 * Deliver page — WordPress page with slug DELIVER_PAGE_SLUG (default "deliver"),
 * ACF field group "Deliver Page". Empty fields fall back to the text below (from Figma).
 */

export const DELIVER_DEFAULTS = {
  title: 'Deliver',
  hero: {
    breadcrumb: 'TechChoice / Deliver',
    title: ['Deliver: Decisions were made. Now We Make It Real.'],
    lead: 'Execution, held to a deadline, with someone accountable for it.',
    path: {
      label: 'The critical path',
      steps: ['Plan', 'Coordinate', 'Implement', 'Go-live'],
      foot: 'One owner across every workstream.',
    },
    foot: 'Independent thinking. Accountable execution.',
  },
  problem: {
    label: '01 / The problem we solve',
    title: ['Close the gap', 'between signed', 'and running.'],
    body: paras(
      'Every technology leader has lived this: the contract’s signed, the kickoff call happens, everyone’s excited, and then implementation quietly stalls because the vendor’s project manager also owns twelve other accounts and yours isn’t the squeaky wheel this month. Deliver is where we stop that from being your problem. Once the Design stage is complete, we take over execution. We are accountable, and do not let “we’re working on it” become an acceptable status update for two straight quarters.',
      'We move to the driver’s seat ingesting all project statements, mapping all dependencies into a single dashboard, and managing all risks. Your project burden will decrease, and responses will be clear and concise as we push the project down the critical path. There will be no learning as we go; we have the data, we’ve done it before, and now it’s time to do it for you. We deliver your project intentions -- not a product.'
    ),
    image: '/images/deliver/deliver-wide.jpg',
  },
  included: {
    label: '02 / What’s included',
    title: 'Here’s What Deliver Actually Looks Like',
    items: [
      { icon: 'kanban', title: 'Project Management', text: 'One point of accountability across every vendor and workstream involved, so nobody gets to hide behind "that’s a different team."' },
      { icon: 'shield_alert', title: 'Risk Management', text: 'Every dependency and integration point gets actively monitored through execution, so a risk flagged in Design doesn’t quietly turn into a live problem nobody’s tracking anymore.' },
      { icon: 'handshake', title: 'Vendor Coordination', text: 'When five different vendors need to talk to each other to make your implementation work, we make them do it, on schedule.' },
      { icon: 'eye', title: 'Implementation Oversight', text: 'We’re present for installs, cutovers, and go-lives, catching problems before they become outages your end users are screenshotting for Slack.' },
      { icon: 'calendar', title: 'Timeline Enforcement', text: 'Milestones get tracked and enforced. If a vendor slips, they hear about it from us before it becomes your emergency.' },
      { icon: 'wallet', title: 'Fiscal Management', text: 'We track spend against the budget that was actually promised, so scope creep and surprise change orders get caught before they hit an invoice.' },
      { icon: 'dashboard', title: 'Realtime Dashboarding', text: 'Live visibility into project status, spend, and milestones in one place, so you can check progress yourself instead of waiting on someone else’s status update.' },
      { icon: 'report', title: 'Departmental Reporting', text: 'Reporting tailored to whoever’s looking at it, so finance, IT, and ops each get the numbers relevant to them without digging through a dashboard built for someone else.' },
      { icon: 'refresh', title: 'Change Management', text: 'We manage the shift itself: what’s changing, when, and how it affects the people who touch it daily, so the rollout doesn’t blindside anyone who wasn’t in the room when the deal was signed.' },
    ],
  },
  value: {
    label: '03 / The value',
    title: 'Why this matters.',
    body: paras(
      'Most tech initiatives don’t fail because the strategy was wrong. They fail in the execution gap, the space between “we signed the contract” and “it’s actually running,” where resources have shifted and suppliers have stopped paying attention. Deliver closes that gap. You get the outcome you were promised, not the version that shows up after six rounds of scope creep.'
    ),
    button_label: 'Get Deliver Working for You',
    button_url: '/#contact',
  },
};

export const getDeliverPage = () => getPhasePage(process.env.DELIVER_PAGE_SLUG || 'deliver', DELIVER_DEFAULTS);
