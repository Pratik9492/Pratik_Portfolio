import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

interface Experience {
  company: string;
  role: string;
  duration: string;
  details: string[];
  color?: string;
}

@Component({
  selector: 'app-home-experience',
  templateUrl: './home-experience.component.html',
  styleUrls: ['./home-experience.component.scss'],
  animations: [
    trigger('transitionText', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate(
          '{{animDelay}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ], { params: { animDelay: 300 } }),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        )
      ])
    ])
  ]
})
export class HomeExperienceComponent {
  _mTriggerAnim = true;
  _mTriggerImage = true;
  _mThreshold = 0.2;

  experiences: Experience[] = [
    {
      company: 'TrueMirror Technologies',
      role: 'Software Developer',
      duration: 'May 2024 – Present',
      details: [
        'Develop and maintain scalable full-stack web applications using Angular (frontend) and .NET Core with MySQL (backend), ensuring high performance, security, and responsive design across all devices.',
        'Design and implement RESTful APIs, integrating them seamlessly with Angular components to enable dynamic, data-driven functionality and enhance overall user experience.',
        'Elevate UI/UX quality by creating reusable, modular Angular components and ensuring cross-browser compatibility and consistent responsive behavior.',
        'Collaborate in agile teams, actively participating in sprint planning, code reviews, and daily standups to deliver high-quality features within deadlines and continuously improve development practices.',
        'Optimize backend performance by crafting efficient MySQL queries, stored procedures, and indexes, and by diagnosing and resolving complex issues across the full application stack.'
      ],
      color: '#DD0031' // Angular red accent
    },
    {
      company: 'Cogent E-Services (Bajaj Finserv Ltd)',
      role: 'Customer Support Associate',
      duration: 'Nov 2023 – Apr 2024',
      details: [
        'Served as a Customer Support Associate for Bajaj Finserv, managing customer interactions and guiding them through the complete loan application process.',
        'Processed end-to-end personal loan applications, ensuring accuracy in documentation, eligibility verification, and approval coordination.',
        'Successfully contributed to loan disbursements worth ₹2 Crores, supporting business growth through quality service and customer satisfaction.',
        'Maintained high standards of compliance and data integrity, while effectively resolving customer queries and ensuring smooth loan processing.'
      ],
      color: '#1976D2' // Material blue accent
    },
    {
      company: 'SmartX Brains Solution',
      role: 'Software Intern',
      duration: 'Jan 2023 – Oct 2023',
      details: [
        'Designed and implemented responsive user interfaces, improving cross-device compatibility and user experience.',
        'Created platforms with Angular programmed with functional, reactive, and object-oriented programming paradigms.',
        'Collaborated with senior developers to translate UI/UX designs into functional web pages, following best practices in clean and maintainable code.',
        'Gained hands-on experience in debugging, browser compatibility, and performance optimization for frontend components.'
      ],
      color: '#00ACC1' // cyan accent
    }
  ];

  selectedExperience: Experience = this.experiences[0];

  selectExperience(exp: Experience): void {
    this.selectedExperience = exp;
  }
}
