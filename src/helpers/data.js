const AffiliateData = [
    {
        id: 199,
        title: "Деревня Универсиады, 15а",
        telegramLink: "https://t.me/URMANCAFEDU",
        whatsappLink: "https://wa.me/79991234567",
        images: [
            "/imgs/photo-5.jpg",
            "/imgs/photo-6.jpg"
        ]
    },
    {
        id: 194,
        title: "Царёво Габдуллы Тукая, 2",
        telegramLink: "https://t.me/urmanTcarevo",
        whatsappLink: "https://wa.me/79991234568",
        images: [
            "/imgs/photo-13.jpg",
            "/imgs/photo-14.jpg"
        ]
    },
    {
        id: 197,
        title: "Некравсова, 9",
        telegramLink: "https://t.me/Urman_NK",
        whatsappLink: "https://wa.me/79991234569",
        images: [
            "/imgs/photo-7.jpg",
            "/imgs/photo-8.jpg"
        ]
    },
    {
        id: 195,
        title: "Горкинско-Ометьевский лес Проспект Победы, 69",
        telegramLink: "https://t.me/Urmancafe",
        whatsappLink: "https://wa.me/79991234570",
        images: [
            "/imgs/photo-1.jpg",
            "/imgs/photo-2.jpg"
        ]
    },
    {
        id: 202,
        title: "ГУМ, Баумана 51",
        telegramLink: "https://t.me/UrmanGoom",
        whatsappLink: "https://wa.me/79991234571",
        images: [
            "/imgs/photo-11.jpg",
            "/imgs/photo-12.jpg"
        ]
    },
    {
        id: 198,
        title: "Магеллан Чистопольская улица, 36",
        telegramLink: "https://t.me/ArtcoreMagellan",
        whatsappLink: "https://wa.me/79991234572",
        images: [
            "/imgs/photo-9.jpg",
            "/imgs/photo-10.jpg"
        ]
    },
    {
        id: 196,
        title: "Салават Купере",
        telegramLink: "https://t.me/Urmansalavat",
        whatsappLink: "https://wa.me/79992555555",
        images: [
            "/imgs/photo-3.jpg",
            "/imgs/photo-4.jpg"
        ]
    }
];
const AffiliateOne = (id) => {
    return AffiliateData.find(e => e.id == id) ?? []
};

export { AffiliateData, AffiliateOne };

