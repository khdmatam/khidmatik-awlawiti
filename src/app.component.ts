
import { Component, ChangeDetectionStrategy, signal, computed, AfterViewInit, OnDestroy, ElementRef, inject, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SERVICES_DATA, ServiceCategory, Service } from './services-data';

export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  review: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private observer?: IntersectionObserver;
  private testimonialInterval?: number;

  readonly serviceCategories = signal<ServiceCategory[]>(SERVICES_DATA);
  readonly whatsAppNumber = '966598158587';
  readonly baseWhatsAppUrl = `https://wa.me/${this.whatsAppNumber}`;
  readonly currentYear = new Date().getFullYear();

  searchTerm = signal('');
  activeSectionId = signal<string>('passports');
  showScrollToTopButton = signal(false);
  activeTestimonialIndex = signal(0);
  isSearchFocused = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const searchContainer = this.elementRef.nativeElement.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
      this.isSearchFocused.set(false);
    }
  }

  readonly testimonials = signal<Testimonial[]>([
    {
      name: 'فهد المطيري',
      city: 'الرياض',
      rating: 5,
      review: 'رسوم رخص العمل كانت مرتفعة جدًا، وفريق "خدمتك أولويتي" ساعدني في الحصول على إعفاء للمنشأة. جددت لعمالي بـ 100 ريال فقط. شكرًا لجهودكم.'
    },
    {
      name: 'عبدالله محمد',
      city: 'جدة',
      rating: 5,
      review: 'كان كفيلي السابق يرفض نقل كفالتي، وساعدني فريق "خدمتك أولويتي" على إتمام النقل بنجاح. أشكركم جزيل الشكر على مصداقيتكم.'
    },
    {
      name: 'نورة القحطاني',
      city: 'الدمام',
      rating: 5,
      review: 'كنت بحاجة لإصدار سجل تجاري وبدء مشروعي الخاص. قاموا بإنهاء كافة الإجراءات في وقت قياسي وباحترافية عالية. خدمة رائعة بالفعل.'
    },
    {
      name: 'سيد خان',
      city: 'المدينة المنورة',
      rating: 5,
      review: 'خدمة ممتازة وسريعة! ساعدوني في الحصول على الكشف الطبي اللازم لإصدار إقامتي دون أي تعقيدات. أنصح بهم بشدة.'
    },
     {
      name: 'صالح الغامدي',
      city: 'مكة المكرمة',
      rating: 5,
      review: 'أكثر خدمة احترافية تعاملت معها. ساعدوني في تصديق العقود من الغرفة التجارية بسرعة. تواصلهم واضح ومتوفرون دائمًا.'
    },
    {
      name: 'فاطمة أحمد',
      city: 'أبها',
      rating: 5,
      review: 'واجهت صعوبة في تجديد إقامات أبنائي بعد وفاة زوجي. الفريق تعامل مع الموضوع باحترافية وتعاطف كبير. أنا ممتنة جدًا لهم.'
    },
    {
      name: 'عائشة العتيبي',
      city: 'حائل',
      rating: 5,
      review: 'كان لدي تأشيرة خروج نهائي طارئة وتحتاج إلى إلغاء. لقد تعاملوا معها بسرعة لا تصدق وأنقذوني من موقف صعب. لا أستطيع أن أوفيهم حقهم من الشكر.'
    },
    {
      name: 'مريم إبراهيم',
      city: 'تبوك',
      rating: 4,
      review: 'ساعدوني في حل مشكلة متعلقة بنظام حماية الأجور. كان الفريق على دراية كبيرة بالأنظمة وتابعوا معي حتى تم حل المشكلة. شكرًا لكم.'
    }
  ]);

  readonly activeTestimonial = computed(() => this.testimonials()[this.activeTestimonialIndex()]);

  readonly filteredServiceCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.serviceCategories();
    }

    return this.serviceCategories()
      .map(category => {
        const filteredServices = category.services.filter(
          service =>
            service.name.toLowerCase().includes(term) ||
            service.description.toLowerCase().includes(term)
        );
        return { ...category, services: filteredServices };
      })
      .filter(category => category.services.length > 0);
  });

  readonly generalWhatsAppLink = computed(() => {
    const message = `مرحبًا، أرغب في الاستفسار عن خدماتكم بشكل عام.`;
    return `${this.baseWhatsAppUrl}?text=${encodeURIComponent(message)}`;
  });

  readonly formattedWhatsAppNumber = computed(() => {
    const num = this.whatsAppNumber;
    return `+${num.slice(0, 3)} ${num.slice(3, 5)} ${num.slice(5, 8)} ${num.slice(8)}`;
  });

  private onWindowScroll = () => {
    const yOffset = window.scrollY;
    const show = yOffset > 400;
    this.showScrollToTopButton.set(show);
  }

  ngAfterViewInit(): void {
    const options = {
      rootMargin: '-40% 0px -60% 0px' // Trigger when section is in the middle of the viewport
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSectionId.set(entry.target.id);
        }
      });
    }, options);

    const sections = this.elementRef.nativeElement.querySelectorAll('main section[id]');
    sections.forEach((section: Element) => this.observer?.observe(section));

    window.addEventListener('scroll', this.onWindowScroll);
    this.startTestimonialAutoplay();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    window.removeEventListener('scroll', this.onWindowScroll);
    this.stopTestimonialAutoplay();
  }

  generateWhatsAppLink(serviceName: string): string {
    const message = `مرحبًا، أرغب بالاستفسار عن خدمة: ${serviceName}`;
    return `${this.baseWhatsAppUrl}?text=${encodeURIComponent(message)}`;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex.update(i => (i + 1) % this.testimonials().length);
    this.startTestimonialAutoplay(); // Reset timer on manual navigation
  }

  prevTestimonial(): void {
    this.activeTestimonialIndex.update(i => (i - 1 + this.testimonials().length) % this.testimonials().length);
    this.startTestimonialAutoplay(); // Reset timer on manual navigation
  }

  goToTestimonial(index: number): void {
    this.activeTestimonialIndex.set(index);
    this.startTestimonialAutoplay(); // Reset timer on manual navigation
  }

  startTestimonialAutoplay(): void {
    this.stopTestimonialAutoplay();
    this.testimonialInterval = window.setInterval(() => {
      this.activeTestimonialIndex.update(i => (i + 1) % this.testimonials().length);
    }, 5000);
  }

  stopTestimonialAutoplay(): void {
    clearInterval(this.testimonialInterval);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\u0600-\u06FF-]+/g, ''); // Remove all non-word chars except Arabic letters
  }

  getHighlightedParts(text: string): { before: string; match: string; after: string } {
    const term = this.searchTerm();
    if (!term || !text) {
      return { before: text, match: '', after: '' };
    }
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    if (index === -1) {
      return { before: text, match: '', after: '' };
    }
    const before = text.substring(0, index);
    const match = text.substring(index, index + term.length);
    const after = text.substring(index + term.length);
    return { before, match, after };
  }

  selectService(service: Service, categoryId: string): void {
    const serviceId = `service-${categoryId}-${this.slugify(service.name)}`;
    const element = document.getElementById(serviceId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      this.renderer.addClass(element, 'highlight-flash');
      setTimeout(() => {
        this.renderer.removeClass(element, 'highlight-flash');
      }, 1500);
    }
    
    this.searchTerm.set('');
    this.isSearchFocused.set(false);
  }


  // Helper functions for Testimonial Avatars
  readonly avatarColors = ['bg-sky-200', 'bg-emerald-200', 'bg-amber-200', 'bg-teal-200', 'bg-indigo-200', 'bg-rose-200', 'bg-lime-200'];

  getAvatarBgColor(name:string): string {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash % this.avatarColors.length);
      return this.avatarColors[index];
  }

  getAvatarTextColor(bgColor: string): string {
    return bgColor.replace('-200', '-800').replace('bg-', 'text-');
  }

  // Helper function to dynamically create Tailwind classes
  getBgColor(color: string): string {
    return `bg-${color}-600`;
  }

  getTextColor(color: string): string {
    return `text-${color}-600`;
  }
  
  getHoverBgColor(color: string): string {
    return `hover:bg-${color}-700`;
  }

  getBorderColor(color: string): string {
    return `border-${color}-500`;
  }

  getLightBgColor(color: string): string {
    return `bg-${color}-100`;
  }

  getHoverTextColor(color: string): string {
    return `hover:text-${color}-600`;
  }

  getHoverShadowColor(color: string): string {
    return `hover:shadow-${color}-500/20`;
  }
}
