<script setup>
import { computed } from 'vue';
import TopNavBar from '@/components/TopNavBar.vue';

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
<TopNavBar></TopNavBar>
    <div class="main font-sans">
        <section
            class="xl:bg-contain bg-top bg-no-repeat -mt-24 pt-24 bg-[url('@/assets/img/background/intersect.svg')]">
            <div class="px-4 mx-auto">
                <div class="pt-18 text-center">
                    <div class="max-w-2xl mx-auto mb-8">
                        <h2
                            class="text-3xl lg:text-6xl lg:leading-normal mb-4 font-bold font-heading wow animate__animated animate__fadeIn">
                            Connecting Truck Owners and Shippers for Effortless Logistics</h2>
                        <p class="text-gray-600 font-medium leading-relaxed wow animate__animated animate__fadeIn">Welcome to
                            TanGlobal Logistics Group, where we connect truck owners and shippers for effortless
                            logistics. Our platform streamlines the process of transporting goods, ensuring efficiency,
                            transparency, and reliability every step of the way.

                        </p>
                    </div>
                    <div>
                        <a class="bg-blue-600 text-white py-4 px-8 mr-2 text-xl" href="#key-features">Key
                            Features</a>
                        <a class="bg-primary py-4 px-8 mr-2 text-xl" data-wow-delay=".3s" href="#how-we-work">How We
                            Work?</a>
                    </div>
                </div>
            </div>
            <div class="relative max-w-6xl mt-16 md:mt-8 mb-8 mx-auto">
                <img src="@/assets/img/background/pattern.png" alt="" />
                <div class="absolute" style="top: 9%; left: 14%; width: 72%; height: 66%">
                    <img class="jump rounded" src="@/assets/img/background/dashboard.png" alt="" />
                </div>
            </div>
            <div class="container px-24 mx-auto">
                <div class="flex flex-wrap justify-between pt-8 pb-16">
                    <div class="hover-up-5 flex w-1/2 lg:w-auto py-4" data-wow-delay=".2s">
                        <div
                            class="flex justify-center items-center bg-green-100 text-green-900 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                </path>
                            </svg>
                        </div>
                        <div class="sm:py-2 ml-2 sm:ml-6">
                            <span class="sm:text-2xl font-bold font-heading">+ </span>
                            <span class="sm:text-2xl font-bold font-heading count">150</span>
                            <p class="text-xs sm:text-base text-gray-400">Annual Partner</p>
                        </div>
                    </div>
                    <div class="hover-up-5 flex w-1/2 lg:w-auto py-4" data-wow-delay=".4s">
                        <div
                            class="flex justify-center items-center bg-green-100 text-green-900 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z">
                                </path>
                            </svg>
                        </div>
                        <div class="sm:py-2 ml-2 sm:ml-6">
                            <span class="sm:text-2xl font-bold font-heading">+ </span>
                            <span class="sm:text-2xl font-bold font-heading count">58</span>
                            <span class="sm:text-2xl font-bold font-heading"> k </span>
                            <p class="text-xs sm:text-base text-gray-400">Completed Projects</p>
                        </div>
                    </div>
                    <div class="hover-up-5 flex w-1/2 lg:w-auto py-4" data-wow-delay=".6s">
                        <div
                            class="flex justify-center items-center bg-green-100 text-green-900 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z">
                                </path>
                            </svg>
                        </div>
                        <div class="sm:py-2 ml-2 sm:ml-6">
                            <span class="sm:text-2xl font-bold font-heading">+ </span>
                            <span class="sm:text-2xl font-bold font-heading count">500</span>
                            <p class="text-xs sm:text-base text-gray-400">Happy Customers</p>
                        </div>
                    </div>
                    <div class="hover-up-5 flex w-1/2 lg:w-auto py-4" data-wow-delay=".8s">
                        <div
                            class="flex justify-center items-center bg-green-100 text-green-900 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                                </path>
                            </svg>
                        </div>
                        <div class="sm:py-2 ml-2 sm:ml-6">
                            <span class="sm:text-2xl font-bold font-heading">+ </span>
                            <span class="sm:text-2xl font-bold font-heading count">320</span>
                            <p class="text-xs sm:text-base text-gray-400">Research Work</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!--Features-->
        <section class="py-12 md:py-16 lg:py-32 overflow-x-hidden" id="features">
            <div class="container px-4 mx-auto">
                <div class="flex flex-wrap lg:flex-nowrap">
                    <div class="w-full lg:w-1/2">
                        <div class="lg:py-6 lg:pr-32 wow animate__animated animate__fadeIn" data-wow-delay=".3s">
                            <div class="mb-4">
                                <span
                                    class="text-xs py-1 px-3 text-blue-500 font-semibold bg-blue-50 rounded-xl wow animate__animated animate__fadeInDown"
                                    data-wow-delay=".9s">Why choose us</span>
                                <h2 class="text-4xl mt-5 font-bold font-heading" data-wow-delay=".3s">Key Features</h2>
                            </div>

                            <div class="flex items-start py-4" data-wow-delay=".7s">
                                <div class="w-8 mr-5 text-green-500">
                                    <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="mb-2 text-xl font-semibold font-heading">User-Friendly Interface</h3>
                                    <p class="text-gray-500 font-medium">The platform features an intuitive interface
                                        for easy navigation, registration, and onboarding. Advanced algorithms swiftly
                                        match users with the ideal trucks, complemented by a seamless booking system
                                        with integrated calendar for managing upcoming hires.</p>
                                </div>
                            </div>


                            <div class="flex items-start py-4" data-wow-delay=".7s">
                                <div class="w-8 mr-5 text-green-500">
                                    <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="mb-2 text-xl font-semibold font-heading">Real-Time Tracking and
                                        Transparent Pricing</h3>
                                    <p class="text-gray-500 font-medium">Our app features GPS-enabled real-time
                                        tracking, allowing users to monitor truck locations and estimated arrival times.
                                        Transparent pricing ensures clear, upfront costs with detailed breakdowns and
                                        invoices for each transaction, fostering trust and clarity.</p>
                                </div>
                            </div>
                            <div class="flex items-start py-4" data-wow-delay=".9s">
                                <div class="w-8 mr-5 text-green-500">
                                    <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="mb-2 text-xl font-semibold font-heading">Security</h3>
                                    <p class="text-gray-500 font-medium">The app offers secure payment options,
                                        including credit/debit cards, mobile money, and bank transfers, all with
                                        encrypted transactions. Our 24/7 customer support is accessible via chat, phone,
                                        and email, supported by a comprehensive help center for common queries.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="relative w-full lg:w-1/2 my-12 lg:my-0">
                        <div class="wow animate__animated animate__fadeInRight" data-wow-delay=".5s">
                            <img class="jump relative mx-auto rounded-xl w-full z-10"
                                src="@/assets/img/placeholder/img-1.png" alt="" />
                            <img class="absolute top-0 left-0 w-40 -ml-12 -mt-12" src="@/assets/branding/blob-tear.svg"
                                alt="" />
                            <img class="absolute bottom-0 right-0 w-40 -mr-12 -mb-12"
                                src="@/assets/branding/blob-tear.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-gray-50" id="how-we-work">
            <div class="container px-4 mx-auto">
                <div class="flex flex-wrap items-center justify-between max-w-2xl lg:max-w-full mb-12">
                    <div class="w-full lg:w-1/2 mb-4 lg:mb-0">
                        <h2
                            class="text-3xl md:text-4xl font-bold font-heading wow animate__animated animate__fadeInDown">
                            <span>How it works</span>
                            <br />
                            <span>Seal the Deal, Share Your Zeal</span>
                        </h2>
                    </div>
                    <div class="w-full lg:w-1/2">
                        <p class="text-gray-400 py-4">Discover a streamlined logistics experience with TanGlobal
                            Logistics Group. Whether you're a truck owner looking to optimize your fleet or a shipper in
                            need of reliable transport solutions, our platform simplifies the process from start to
                            finish.</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                    <div class="hover-up-5 px-3 mb-6">
                        <div class="p-12 bg-white shadow rounded">
                            <div
                                class="flex w-12 h-12 mx-auto items-center justify-center text-blue-800 font-bold font-heading bg-blue-200 rounded-full">
                                1</div>
                            <img class="h-48 mx-auto my-4" src="@/assets/img/how/web.svg" alt="" />
                            <h3 class="mb-2 font-bold font-heading">Register Your Trucks</h3>
                            <p class="text-sm text-gray-400 leading-relaxed">Begin by registering your fleet of trucks
                                on our platform. Provide details such as type, capacity, and availability to showcase
                                your offerings.</p>
                        </div>
                    </div>
                    <div class="hover-up-5 px-3 mb-6">
                        <div class="p-12 bg-white shadow rounded">
                            <div
                                class="flex w-12 h-12 mx-auto items-center justify-center text-blue-800 font-bold font-heading bg-blue-200 rounded-full">
                                2</div>
                            <img class="h-48 mx-auto my-4" src="@/assets/img/how/team.svg" alt="" />
                            <h3 class="mb-2 font-bold font-heading">Browse and Match</h3>
                            <p class="text-sm text-gray-400 leading-relaxed">Shippers can browse available trucks based
                                on their specific transport needs, utilizing advanced search filters for efficient
                                matching.</p>
                        </div>
                    </div>
                    <div class="hover-up-5 px-3 mb-6">
                        <div class="p-12 bg-white shadow rounded">
                            <div
                                class="flex w-12 h-12 mx-auto items-center justify-center text-blue-800 font-bold font-heading bg-blue-200 rounded-full">
                                3</div>
                            <img class="h-48 mx-auto my-4" src="@/assets/img/how/delivered.svg" alt="" />
                            <h3 class="mb-2 font-bold font-heading">Complete and Review</h3>
                            <p class="text-sm text-gray-400 leading-relaxed">After successful delivery, both parties can
                                finalize the transaction securely and provide feedback to maintain high service
                                standards.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <section class="py-20 xl:bg-contain bg-top bg-no-repeat bg-[url('@/assets/img/background/intersect.svg')]">
            <div class="container px-4 mx-auto">
                <div class="text-center mb-16">
                    <h2 class="max-w-lg mx-auto mb-4 text-4xl font-bold font-heading" data-wow-delay=".2s">
                        <span>Find the Right Fit for Your Business</span>
                        <span class="text-blue-500"> choose </span>
                        <span>your best plan</span>
                    </h2>
                    <p class="max-w-sm mx-auto text-lg text-gray-400 wow animate__animated animate__fadeInDown"
                        data-wow-delay=".5s">Experience premium logistics solutions by joining today!</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 -mx-3">
                    <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Free</h3>
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">$0</span>
                                <span class="text-600">per month</span>
                                <Button label="Get Started"
                                    class="block mx-auto mt-4 p-2 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Startup</h3>
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">$1</span>
                                <span class="text-600">per month</span>
                                <Button label="Try Free"
                                    class="block mx-auto mt-4 p-2 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="w-full lg:w-1/3 px-3 mb-6">
                        <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                            style="border-radius: 10px">
                            <h3 class="text-900 text-center my-5">Enterprise</h3>
                            <div class="my-5 text-center">
                                <span class="text-5xl font-bold mr-2 text-900">$999</span>
                                <span class="text-600">per month</span>
                                <Button label="Get a Quote"
                                    class="block mx-auto mt-4 p-2 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Responsive Layout</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">50 Support Ticket</span>
                                </li>
                                <li class="py-2">
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                    <span class="text-xl line-height-3">Free Shipping</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="py-20 bg-top bg-no-repeat bg-[url('@/assets/branding/map.svg')]">
            <div class="container px-4 mx-auto">
                <div class="relative py-20 px-4 lg:p-20">
                    <div class="max-w-lg mx-auto text-center">
                        <h2 class="mb-4 text-3xl lg:text-4xl font-bold font-heading">
                            <span>Subscribe now to</span>
                            <span class="text-blue-500"> Our Newsletter</span>
                            <span> and get updates.</span>
                        </h2>
                        <p class="mb-8 text-gray-400" data-wow-delay=".3s">
                            All your information is completely confidential</p>
                        <div class="p-4 bg-white rounded-lg flex flex-col space-y-4 flex-wrap mx-auto"
                            data-wow-delay=".5s">
                            <div class="flex w-full md:w-2/3 px-3 mb-3 md:mb-0 md:mr-2 bg-gray-100 rounded">
                                <label for="subscribe" class="my-auto"><svg class="h-6 w-6 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z">
                                        </path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg></label>
                                <input
                                    class="w-full py-4 text-xs text-gray-400 font-semibold leading-none bg-gray-100 outline-none flex-grow"
                                    type="text" placeholder="Type your e-mail" id="subscribe" />
                            </div>
                            <button
                                class="w-full md:w-auto py-4 px-8 text-xs text-white font-semibold leading-none bg-blue-400 hover:bg-blue-500 rounded"
                                type="submit">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="py-20">
            <!-- <div class="container px-4 mx-auto wow animate__animated animate__fadeIn" data-wow-delay=".3s">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 lg:mb-20 -mx-3 text-center lg:text-left">
                    <div class="w-full lg:w-1/5 px-3 mb-6 lg:mb-0">
                        <a class="inline-block mx-auto lg:mx-0 text-3xl font-semibold leading-none" href="index.html">
                            <img class="h-10" src="assets/imgs/logos/monst-logo.svg" alt="" />
                        </a>
                    </div>
                    <div class="w-full lg:w-2/5 px-3 mb-8 lg:mb-0">
                        <p
                            class="max-w-md mx-auto lg:max-w-full lg:mx-0 lg:pr-32 lg:text-lg text-gray-400 leading-relaxed">
                            Helping you <strong>maximize</strong> operations management with digitization</p>
                    </div>
                    <div class="w-full lg:w-1/5 px-3 mb-8 lg:mb-0">
                        <p class="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-gray-800">Office</p>
                        <p class="lg:text-lg text-gray-400">359 Hidden Valley Road, NY</p>
                    </div>
                    <div class="w-full lg:w-1/5 px-3">
                        <p class="mb-2 lg:mb-4 lg:text-lg font-bold font-heading text-gray-800">Contacts</p>
                        <p class="lg:text-lg text-gray-400">(+01) 234 568</p>
                        <p class="lg:text-lg text-gray-400"><a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                                data-cfemail="5d3e3233293c3e291d3032332e29733e3230">[email&#160;protected]</a></p>
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row items-center lg:justify-between">
                    <p class="text-sm text-gray-400">&copy; 2021. All rights reserved. Designed by <a
                            class="text-blue-400" href="https://alithemes.com" target="_blank">Alithemes.com</a></p>
                    <div class="order-first lg:order-last -mx-2 mb-4 lg:mb-0">
                        <a class="inline-block px-2" href="#">
                            <img src="assets/imgs/icons/facebook-blue.svg" alt="" />
                        </a>
                        <a class="inline-block px-2" href="#">
                            <img src="assets/imgs/icons/twitter-blue.svg" alt="" />
                        </a>
                        <a class="inline-block px-2" href="#">
                            <img src="assets/imgs/icons/instagram-blue.svg" alt="" />
                        </a>
                    </div>
                </div>
            </div> -->
            
        </section>
    </div>



<footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ new Date().getFullYear()}} TanGlobal™. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" class="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>
</template>

<style scoped>
#hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
}
</style>
