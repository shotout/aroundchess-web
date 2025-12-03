"use client";

import Image from "next/image";

interface Props {
    onClick: () => void;
}

export default function AccountNotConnected(props: Props) {
    return (
        <>
            <div className="relative w-full overflow-hidden bg-[linear-gradient(to_right,#25CADC,#2327EB)] border-b-[6px] border-[#102299] flex flex-col lg:flex-row items-center justify-between p-[16px] md:py-[24px] md:px-[32px] gap-[8px] my-[16px] rounded-[16px]">
                <Image src={"/images/union.svg"} alt="..." width={237} height={75} className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
                <div className="flex items-center gap-[12px]">
                    <Image src={"/icons/account-not-connected.svg"} alt="..." width={102} height={75} className="w-[75px] h-[56px] md:w-[102px] md:h-[75px]" />
                    <div className="w-full text-white">
                        <h3 className="text-[16px] md:text-[18px] font-semibold leading-[130%] mb-[8px]">Your Chess.com account is not connected</h3>
                        <p className="text-[14px] md:text-[16px] leading-[140%]">Connect your Chess.com account to start analyzing your <br className="hidden lg:block" />Chess.com games.</p>
                    </div>
                </div>

                <button type="button" onClick={props.onClick} className="flex w-full md:w-auto items-center gap-[8px] py-[12px] px-[32px] text-white text-[15px] font-semibold rounded-full bg-[rgba(255,255,255,.2)] hover:bg-[rgba(255,255,255,.3)]">
                    <span>Connect Chess.com Account</span>
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.4209 8.67476L11.6709 15.4248C11.4596 15.6361 11.1729 15.7548 10.8741 15.7548C10.5752 15.7548 10.2885 15.6361 10.0772 15.4248C9.86584 15.2134 9.74711 14.9268 9.74711 14.6279C9.74711 14.329 9.86584 14.0424 10.0772 13.831L14.9062 9.00383H1.125C0.826631 9.00383 0.540483 8.8853 0.329505 8.67432C0.118526 8.46334 0 8.1772 0 7.87883C0 7.58046 0.118526 7.29431 0.329505 7.08333C0.540483 6.87235 0.826631 6.75383 1.125 6.75383H14.9062L10.0791 1.92383C9.86772 1.71248 9.74899 1.42584 9.74899 1.12695C9.74899 0.828065 9.86772 0.541421 10.0791 0.330076C10.2904 0.118732 10.5771 3.14928e-09 10.8759 0C11.1748 -3.14928e-09 11.4615 0.118732 11.6728 0.330076L18.4228 7.08008C18.5277 7.18473 18.6109 7.30908 18.6676 7.44598C18.7243 7.58288 18.7534 7.72963 18.7532 7.87781C18.7531 8.02599 18.7236 8.17267 18.6666 8.30944C18.6096 8.4462 18.5261 8.57035 18.4209 8.67476Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </>
    );
}