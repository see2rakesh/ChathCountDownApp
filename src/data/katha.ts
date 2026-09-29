import type { Lang } from '@/lib/i18n';

type L = Record<Lang, string>;

export interface KathaSection {
  id: string;
  icon: string;
  title: L;
  paras: L[];
}

export interface Legend {
  id: string;
  title: L;
  /** Where the story comes from (scripture or folk tradition). */
  source: L;
  text: L;
}

/**
 * History and meaning of Chhath. Origins are told as traditions, not historical claims:
 * legends differ by region and family, and the app says so.
 */
export const KATHA_INTRO: L = {
  en: 'Chhath Mahaparv is one of the oldest and strictest festivals of India and Nepal: four days of devotion to Surya, the Sun, and Chhathi Maiya, observed at rivers and ponds with no idol and no priest in between.',
  hi: 'छठ महापर्व भारत और नेपाल के सबसे प्राचीन और कठिन व्रतों में से एक है: सूर्य देव और छठी मईया की चार दिन की उपासना, नदी-तालाब के घाट पर, बिना मूर्ति और बिना पुरोहित के।',
};

export const KATHA_SECTIONS: KathaSection[] = [
  {
    id: 'meaning',
    icon: '🌞',
    title: { en: 'What Chhath is', hi: 'छठ क्या है' },
    paras: [
      {
        en: 'The name comes from "Shashthi", the sixth day: the main offering falls on Kartik Shukla Shashthi, six days after Diwali. A second, smaller Chhath is kept in spring, in the month of Chaitra (Chaiti Chhath).',
        hi: '"छठ" शब्द "षष्ठी" से बना है: मुख्य अर्घ्य कार्तिक शुक्ल षष्ठी को होता है, दीपावली के छह दिन बाद। वसंत में चैत्र महीने में भी छठ होता है, जिसे चैती छठ कहते हैं।',
      },
      {
        en: 'Devotees thank the Sun, the source of light, warmth and harvest, and pray to Chhathi Maiya for the health, long life and happiness of their children and family.',
        hi: 'व्रती प्रकाश, ऊष्मा और अन्न के दाता सूर्य देव का आभार मानते हैं, और छठी मईया से संतान व परिवार के स्वास्थ्य, दीर्घायु और सुख की कामना करते हैं।',
      },
    ],
  },
  {
    id: 'importance',
    icon: '🙏',
    title: { en: 'Why it matters', hi: 'छठ का महत्व' },
    paras: [
      {
        en: 'Chhath is the rare festival that honours the setting sun as well as the rising sun: thanks for the day that has passed, and hope for the day to come. The evening offering is also said to be for Pratyusha, the last ray of the sun, and the morning offering for Usha, the first.',
        hi: 'छठ ऐसा दुर्लभ पर्व है जिसमें उगते ही नहीं, डूबते सूर्य को भी अर्घ्य दिया जाता है: बीते दिन का आभार और आने वाले दिन की आशा। मान्यता है कि संध्या अर्घ्य सूर्य की अंतिम किरण प्रत्यूषा को और उषा अर्घ्य पहली किरण उषा को समर्पित है।',
      },
      {
        en: 'It asks for purity and self-discipline: a clean home, satvik food, and a nirjala fast of about 36 hours, without even water.',
        hi: 'यह पवित्रता और संयम का पर्व है: घर की शुद्धि, सात्विक भोजन, और लगभग 36 घंटे का निर्जला व्रत, बिना जल के।',
      },
      {
        en: 'It belongs to everyone. There is no idol and no priest; the devotee offers arghya directly to the Sun. Rich and poor stand in the same water, neighbours clean the ghats together, and prasad is shared with all.',
        hi: 'यह सबका पर्व है। न मूर्ति, न पुरोहित; व्रती सीधे सूर्य को अर्घ्य देते हैं। अमीर-गरीब एक ही पानी में खड़े होते हैं, पड़ोसी मिलकर घाट साफ़ करते हैं, और प्रसाद सबमें बँटता है।',
      },
      {
        en: 'It stays close to nature: offerings are seasonal fruits, sugarcane, turmeric and thekua, carried in bamboo soop and daura, with clay lamps.',
        hi: 'यह प्रकृति से जुड़ा पर्व है: मौसमी फल, गन्ना, हल्दी और ठेकुआ, बाँस के सूप-दउरा में, मिट्टी के दीयों के साथ।',
      },
    ],
  },
  {
    id: 'history',
    icon: '📜',
    title: { en: 'History', hi: 'इतिहास' },
    paras: [
      {
        en: 'Worship of the Sun is among the oldest traditions in India: the Rigveda contains hymns to Surya, and the Gayatri mantra is addressed to Savitr, the Sun as the giver of life. Chhath is often described as a living continuation of this ancient sun worship.',
        hi: 'सूर्य उपासना भारत की सबसे पुरानी परंपराओं में है: ऋग्वेद में सूर्य की स्तुतियाँ हैं, और गायत्री मंत्र जीवनदाता सवितृ (सूर्य) को समर्पित है। छठ को अक्सर इसी प्राचीन सूर्य उपासना की जीवित परंपरा माना जाता है।',
      },
      {
        en: 'Over centuries it grew as a folk festival of the Magadh, Mithila and Bhojpur regions, carried by songs sung by women from generation to generation, long before it was written down.',
        hi: 'सदियों में यह मगध, मिथिला और भोजपुर क्षेत्र का लोकपर्व बना, और लिखे जाने से बहुत पहले से महिलाओं के गाए गीतों के सहारे पीढ़ी-दर-पीढ़ी आगे बढ़ा।',
      },
    ],
  },
  {
    id: 'where',
    icon: '🗺️',
    title: { en: 'Where it is celebrated', hi: 'कहाँ मनाया जाता है' },
    paras: [
      {
        en: 'Its heartland is Bihar, Jharkhand, eastern Uttar Pradesh (Purvanchal) and the Madhesh (Terai) region of Nepal.',
        hi: 'इसका मूल क्षेत्र बिहार, झारखंड, पूर्वी उत्तर प्रदेश (पूर्वांचल) और नेपाल का मधेश (तराई) क्षेत्र है।',
      },
      {
        en: 'Wherever families from these regions have gone, Chhath has followed: Delhi, Mumbai, Kolkata, Surat, Punjab and beyond, where rivers, lakes, beaches and even rooftop tanks become ghats.',
        hi: 'इन क्षेत्रों के परिवार जहाँ गए, छठ साथ गया: दिल्ली, मुंबई, कोलकाता, सूरत, पंजाब और आगे, जहाँ नदी, झील, समुद्र तट और छत पर बने कुंड भी घाट बन जाते हैं।',
      },
      {
        en: 'Overseas, it is kept by descendants of Indian indentured labourers in Mauritius, Fiji, Trinidad and Tobago, Suriname and Guyana, and by Indian and Nepali communities in the Gulf, the United States, the United Kingdom, Canada and Australia.',
        hi: 'विदेश में मॉरीशस, फ़िजी, त्रिनिदाद और टोबैगो, सूरीनाम और गयाना में गिरमिटिया वंशज, और खाड़ी देशों, अमेरिका, ब्रिटेन, कनाडा व ऑस्ट्रेलिया में भारतीय और नेपाली समुदाय छठ मनाते हैं।',
      },
      {
        en: 'Well-known places of Chhath include the Ganga ghats of Patna, and the Sun temples of Deo (Aurangabad), Ulaar (Patna district) and Baragaon (Nalanda) in Bihar, where large Chhath fairs are held.',
        hi: 'छठ के प्रसिद्ध स्थानों में पटना के गंगा घाट, और बिहार के देव (औरंगाबाद), उलार (पटना ज़िला) और बड़गाँव (नालंदा) के सूर्य मंदिर शामिल हैं, जहाँ छठ पर बड़े मेले लगते हैं।',
      },
    ],
  },
];

export const LEGENDS_TITLE: L = { en: 'How it began: the stories', hi: 'कैसे शुरू हुआ: कथाएँ' };

export const LEGENDS: Legend[] = [
  {
    id: 'priyavrat',
    title: { en: 'King Priyavrat and Shashthi Devi', hi: 'राजा प्रियव्रत और षष्ठी देवी' },
    source: { en: 'Brahmavaivarta Purana', hi: 'ब्रह्मवैवर्त पुराण' },
    text: {
      en: 'King Priyavrat and Queen Malini longed for a child. When their son was born lifeless, the grieving king was about to give up his own life. Devi Shashthi appeared, restored the child to life, and asked that she be worshipped. Chhathi Maiya is identified with this Shashthi Devi, protector of children.',
      hi: 'राजा प्रियव्रत और रानी मालिनी संतान के लिए तरसते थे। जब उनका पुत्र मृत पैदा हुआ, तो दुखी राजा प्राण त्यागने चले। तब देवी षष्ठी प्रकट हुईं, बालक को जीवित किया और अपनी पूजा का आदेश दिया। छठी मईया को संतान की रक्षक इन्हीं षष्ठी देवी का रूप माना जाता है।',
    },
  },
  {
    id: 'sita',
    title: { en: 'Ram and Sita', hi: 'राम और सीता' },
    source: { en: 'Folk tradition linked to the Ramayana', hi: 'रामायण से जुड़ी लोक परंपरा' },
    text: {
      en: 'Folk tradition holds that after returning to Ayodhya, Ram and Sita fasted and offered arghya to the Sun on Kartik Shukla Shashthi. In Munger, Sita is believed to have kept the vow on the banks of the Ganga, and the place is revered as Sita Charan.',
      hi: 'लोक मान्यता है कि अयोध्या लौटने के बाद राम और सीता ने कार्तिक शुक्ल षष्ठी को व्रत रखकर सूर्य को अर्घ्य दिया। मुंगेर में माना जाता है कि सीता ने गंगा तट पर यह व्रत किया, और वह स्थान सीता चरण के नाम से पूजा जाता है।',
    },
  },
  {
    id: 'karna',
    title: { en: 'Karna, son of Surya', hi: 'सूर्यपुत्र कर्ण' },
    source: { en: 'Tradition linked to the Mahabharata', hi: 'महाभारत से जुड़ी परंपरा' },
    text: {
      en: 'Karna, the son of Surya and king of Anga (around present-day Bhagalpur and Munger), is said to have stood waist-deep in water every day, offering arghya to his father the Sun. The Chhath way of offering arghya while standing in water is traced to him.',
      hi: 'सूर्यपुत्र और अंग देश (आज के भागलपुर-मुंगेर के आसपास) के राजा कर्ण के बारे में कहा जाता है कि वे रोज़ कमर तक पानी में खड़े होकर अपने पिता सूर्य को अर्घ्य देते थे। पानी में खड़े होकर अर्घ्य देने की छठ की रीति उन्हीं से जोड़ी जाती है।',
    },
  },
  {
    id: 'draupadi',
    title: { en: 'Draupadi and the Pandavas', hi: 'द्रौपदी और पांडव' },
    source: { en: 'Folk tradition linked to the Mahabharata', hi: 'महाभारत से जुड़ी लोक परंपरा' },
    text: {
      en: 'Another story says that when the Pandavas lost their kingdom, Draupadi kept the Chhath vow, and with the blessing of the Sun their troubles ended and they regained what they had lost.',
      hi: 'एक और कथा के अनुसार जब पांडव अपना राज्य हार गए, तो द्रौपदी ने छठ व्रत किया, और सूर्य की कृपा से उनके कष्ट दूर हुए और खोया राज्य वापस मिला।',
    },
  },
  {
    id: 'samba',
    title: { en: 'Samba, son of Krishna', hi: 'कृष्णपुत्र साम्ब' },
    source: { en: 'Samba Purana and Bhavishya Purana', hi: 'साम्ब पुराण और भविष्य पुराण' },
    text: {
      en: "Krishna's son Samba, suffering from leprosy, was cured by worshipping the Sun, and in gratitude is said to have built temples to Surya. Many Sun temples in the region connect their origin to this story.",
      hi: 'कृष्ण के पुत्र साम्ब कुष्ठ रोग से पीड़ित थे और सूर्य उपासना से स्वस्थ हुए; कृतज्ञता में उन्होंने सूर्य मंदिर बनवाए, ऐसा कहा जाता है। क्षेत्र के कई सूर्य मंदिर अपनी उत्पत्ति इसी कथा से जोड़ते हैं।',
    },
  },
];

export const KATHA_NOTE: L = {
  en: 'These are the stories most commonly told. They vary by region and family, and are shared here as tradition and faith, not as historical record.',
  hi: 'ये सबसे अधिक प्रचलित कथाएँ हैं। क्षेत्र और परिवार के अनुसार ये अलग हो सकती हैं, और यहाँ आस्था व परंपरा के रूप में दी गई हैं, ऐतिहासिक प्रमाण के रूप में नहीं।',
};
