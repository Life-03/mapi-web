'use client';

import useClientLocale from "./useClientLocale";
import es from "../../i18n/es.json";
import en from "../../i18n/en.json";

export default function Footer() {
    const clientLocale = useClientLocale();
    const currentLocale = clientLocale || "es";
    const activeDict = currentLocale === "en" ? en : es;
    const dict = activeDict;
    return (
        
        <footer className='print:hidden'>
            <div className="bg-[#005249]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 py-10 justify-between ">
                    {/* Redes Sociales */}
                    <div className="w-full text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-2 text-white">{dict?.["footer.follow"] || "SÍGUENOS"}</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href="https://www.facebook.com/lifexpeditionsperu/" target="_blank" rel="noopener noreferrer" aria-label="botón Facebook" className="text-white hover:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2V9.5c0-2 .9-3.2 3.2-3.2h2V9h-1.4c-1.1 0-1.4.5-1.4 1.3V12h3l-.5 3h-2.5v7A10 10 0 0 0 22 12z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/life_expeditions/" target="_blank" rel="noopener noreferrer" aria-label="botón Instagram" className="text-white hover:text-pink-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2h-9zm4.5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                                </svg>
                            </a>
                            <a  href="https://www.tiktok.com/@life_expeditions" target="_blank" aria-label="botón TikTok">
                                <svg className="fill-gray-900 relative z-10 transition-all duration-300 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 42 47" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M30.6721 17.4285C33.7387 19.6085 37.4112 20.7733 41.1737 20.7592V13.3024C40.434 13.3045 39.6963 13.2253 38.9739 13.0663V19.0068C35.203 19.0135 31.5252 17.8354 28.4599 15.6389V30.9749C28.4507 33.4914 27.7606 35.9585 26.4628 38.1146C25.165 40.2706 23.3079 42.0353 21.0885 43.2215C18.8691 44.4076 16.37 44.9711 13.8563 44.852C11.3426 44.733 8.90795 43.9359 6.81055 42.5453C8.75059 44.5082 11.2295 45.8513 13.9333 46.4044C16.6372 46.9576 19.4444 46.6959 21.9994 45.6526C24.5545 44.6093 26.7425 42.8312 28.2864 40.5436C29.8302 38.256 30.6605 35.5616 30.6721 32.8018V17.4285ZM33.3938 9.82262C31.8343 8.13232 30.8775 5.97386 30.6721 3.68324V2.71387H28.5842C28.8423 4.16989 29.4039 5.5553 30.2326 6.78004C31.0612 8.00479 32.1383 9.04144 33.3938 9.82262ZM11.645 36.642C10.9213 35.6957 10.4779 34.5653 10.365 33.3793C10.2522 32.1934 10.4746 30.9996 11.0068 29.9338C11.5391 28.8681 12.3598 27.9731 13.3757 27.3508C14.3915 26.7285 15.5616 26.4039 16.7529 26.4139C17.4106 26.4137 18.0644 26.5143 18.6916 26.7121V19.0068C17.9584 18.9097 17.2189 18.8682 16.4794 18.8826V24.8728C14.9522 24.39 13.2992 24.4998 11.8492 25.1803C10.3992 25.8608 9.25851 27.0621 8.65394 28.5454C8.04937 30.0286 8.02524 31.6851 8.58636 33.1853C9.14748 34.6855 10.2527 35.9196 11.6823 36.642H11.645Z"
                                        fill="#FFF" />
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M28.4589 15.5892C31.5241 17.7857 35.2019 18.9638 38.9729 18.9571V13.0166C36.8243 12.5623 34.8726 11.4452 33.3927 9.82262C32.1372 9.04144 31.0601 8.00479 30.2315 6.78004C29.4029 5.5553 28.8412 4.16989 28.5831 2.71387H23.09V32.8018C23.0849 34.1336 22.6629 35.4304 21.8831 36.51C21.1034 37.5897 20.0051 38.3981 18.7425 38.8217C17.4798 39.2453 16.1162 39.2629 14.8431 38.872C13.57 38.4811 12.4512 37.7012 11.6439 36.642C10.3645 35.9965 9.3399 34.9387 8.7354 33.6394C8.1309 32.3401 7.98177 30.875 8.31208 29.4805C8.64239 28.0861 9.43286 26.8435 10.556 25.9535C11.6791 25.0634 13.0693 24.5776 14.5023 24.5745C15.1599 24.5766 15.8134 24.6772 16.4411 24.8728V18.8826C13.7288 18.9477 11.0946 19.8033 8.86172 21.3444C6.62887 22.8855 4.89458 25.0451 3.87175 27.5579C2.84892 30.0708 2.58205 32.8276 3.10392 35.49C3.62579 38.1524 4.91367 40.6045 6.80948 42.5453C8.90731 43.9459 11.3458 44.7512 13.8651 44.8755C16.3845 44.9997 18.8904 44.4383 21.1158 43.2509C23.3413 42.0636 25.2031 40.2948 26.5027 38.133C27.8024 35.9712 28.4913 33.4973 28.4962 30.9749L28.4589 15.5892Z"
                                        fill="" />
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M38.9736 13.0161V11.4129C37.0005 11.4213 35.0655 10.8696 33.3934 9.82211C34.8695 11.4493 36.8229 12.5674 38.9736 13.0161ZM28.5838 2.71335C28.5838 2.42751 28.4968 2.12924 28.4596 1.8434V0.874023H20.8785V30.9744C20.872 32.6598 20.197 34.2738 19.0017 35.4621C17.8064 36.6504 16.1885 37.3159 14.503 37.3126C13.5106 37.3176 12.5311 37.0876 11.6446 36.6415C12.4519 37.7007 13.5707 38.4805 14.8438 38.8715C16.1169 39.2624 17.4805 39.2448 18.7432 38.8212C20.0058 38.3976 21.1041 37.5892 21.8838 36.5095C22.6636 35.4298 23.0856 34.1331 23.0907 32.8013V2.71335H28.5838ZM16.4418 18.8696V17.167C13.3222 16.7432 10.1511 17.3885 7.44529 18.9977C4.73944 20.6069 2.65839 23.0851 1.54131 26.0284C0.424223 28.9718 0.336969 32.2067 1.29377 35.206C2.25057 38.2053 4.195 40.792 6.81017 42.5448C4.92871 40.5995 3.65455 38.1484 3.14333 35.4908C2.63212 32.8333 2.906 30.0844 3.9315 27.5799C4.957 25.0755 6.68974 22.924 8.91801 21.3882C11.1463 19.8524 13.7736 18.9988 16.4791 18.9318L16.4418 18.8696Z"
                                        fill="" />
                                </svg>
                                
                            </a>
                        </div>
                    </div>
                    {/* Contacto */}
                    <div className="w-full text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-2 text-white">{dict?.["footer.contact"] || "CONTACTO"}</h3>
                        <p className="text-white">📞 +51 940 291 818</p>
                        <p className="text-white">✉️ info@machupicchuavailability.com</p>
                    </div>
                        
                    {/* Enlace a otra web */}
                    <div className="w-full text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-2 text-white">{dict?.["footer.more"] || "MÁS INFORMACIÓN"}</h3>
                        <a href="https://lifexpeditions.com" target="_blank" rel="noopener noreferrer" className=" hover:text-[#fabf02]">
                            {dict?.["footer.other"] || "Visita nuestro otro sitio web"}
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-[#003933]">
                <hr className="border-gray-600"/>
                <div className="flex justify-between py-2 items-center lg:mx-16 mx-2 text-[#FABF02]">
       
                    <span className="text-xs">&copy; {new Date().getFullYear()} Machu Picchu Availability. {dict?.["footer.rights"] || "Todos los derechos reservados."}</span>
                    <div className="flex gap-3 uppercase text-xs font-bold">
                     
                        <a>{dict?.["footer.by"] || "Por Life Expeditions"}</a>
                    </div>

                </div>
            </div>

        </footer>
    );
}
  
