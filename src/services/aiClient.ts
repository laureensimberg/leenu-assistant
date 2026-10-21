/**
 * Client-side fallback intelligence for Leenu when server API is not available
 * (e.g. static hosting on GitHub Pages, offline mode, or connection drops).
 */

export interface ChatResponse {
  reply: string;
  detectedLanguage: 'en' | 'et';
}

export function getClientKnowledgeResponse(query: string, languageMode: 'auto' | 'en' | 'et'): ChatResponse {
  const q = query.toLowerCase();
  const isEst = languageMode === 'et' || /[äöõü]/i.test(query) || /\b(tere|kuidas|miks|kes|räägi|saavutused|kool|suusk|investeerimine|ülikool|ettevõtlus|ebs)\b/i.test(query);

  if (isEst) {
    if (q.includes('ebs') || q.includes('ettevõtlus') || q.includes('õpi') || q.includes('ülikool') || q.includes('kool') || q.includes('haridus')) {
      return {
        reply: "Laureen õpib praegu Estonian Business Schoolis (EBS) mõjusa ettevõtluse (Impactful Entrepreneurship) bakalaureuseõppes. Ta rakendab tippspordi vaimset kindlust ja sihikindlust uuenduslike, jätkusuutlike ettevõtete ülesehitamisel.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('olümpia') || q.includes('saavutus') || q.includes('tulemus') || q.includes('suusk') || q.includes('spord') || q.includes('laskesuusk')) {
      return {
        reply: "Laureen on Eesti juunioride laskesuusakoondise liige. Tema silmapaistvamad saavutused on 12. koht Gangwoni noorte olümpiamängudel, osalemine juunioride MM-il ja Euroopa Noorte Olümpiafestivalil, lisaks on ta kolmekordne Balti meister ja mitmekordne Eesti meister.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('äri') || q.includes('invest') || q.includes('aktsia') || q.includes('toomas') || q.includes('raha')) {
      return {
        reply: "Laureen on aktiivne erainvestor, kes tegeleb süvitsi aktsiaturgudega. Ta on osalenud Eesti Investeerimislaagris ja lõpetanud tunnustatud Investor Toomase e-kursuse, kombineerides finantsturud oma EBS-i õpingutega.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('kontakt') || q.includes('email') || q.includes('e-mail') || q.includes('telefon') || q.includes('soovitaj')) {
      return {
        reply: "Laureeniga saab ühendust meiliaadressil laureen.simberg@gmail.com või telefonil +372 56884875. Tema soovitajateks on Audentese klassijuhataja Anne Matt ja Team Estonia spordipsühholoog Gähtlin Leppanen.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('distsipliin') || q.includes('oskus') || q.includes('töö') || q.includes('pinge')) {
      return {
        reply: "Laskesuusatamine treenib erakordset vaimset stabiilsust: viis täpset lasku 50 meetrilt, kui pulss lööb üle 180 korra minutis. See raudne distsipliin toetab Laureeni igapäevaselt nii EBS-i õpingutes kui ka investeerimises.",
        detectedLanguage: 'et',
      };
    }
    return {
      reply: "Tere! Olen Leenu, Laureen Simbergi häälassistent. Laureen on Eesti juunioride laskesuusakoondislane, noorte olümpia 12. koha omanik ning EBS-i mõjusa ettevõtluse tudeng. Kuidas saan teid aidata?",
      detectedLanguage: 'et',
    };
  } else {
    // English
    if (q.includes('ebs') || q.includes('entrepreneurship') || q.includes('university') || q.includes('study') || q.includes('education') || q.includes('school')) {
      return {
        reply: "Laureen is currently enrolled at Estonian Business School (EBS) in Tallinn, studying for a Bachelor's degree in Impactful Entrepreneurship. She combines the high-performance mindset of biathlon with building forward-thinking, sustainable business ventures.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('olympic') || q.includes('achievement') || q.includes('biathlon') || q.includes('sport') || q.includes('career') || q.includes('result')) {
      return {
        reply: "Laureen is a proud member of the Estonian Junior National Biathlon Team. Her achievements include 12th place at the Youth Olympic Games in Gangwon, competing at the Biathlon Junior World Championships and EYOF, and claiming 3 Baltic Championship titles alongside multiple national medals.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('invest') || q.includes('business') || q.includes('stock') || q.includes('finance')) {
      return {
        reply: "Laureen is an active personal equity investor primarily focused on public stocks. She attended Investment Camp Estonia, completed the Investor Toomas e-course, and is applying financial valuation principles directly to her studies in Impactful Entrepreneurship at EBS.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('reference')) {
      return {
        reply: "You can reach Laureen directly via email at laureen.simberg@gmail.com or by phone at +372 56884875 in Tallinn, Estonia. Her references are Anne Matt from Audentes and Gähtlin Leppanen from Team Estonia.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('discipline') || q.includes('skill') || q.includes('pressure') || q.includes('mindset')) {
      return {
        reply: "Biathlon requires calm, laser-like precision shooting five targets from 50 meters with a racing heart rate above 180 BPM. This has shaped Laureen's resilience, time management, and execution—skills that power both her athletic and business ventures.",
        detectedLanguage: 'en',
      };
    }
    return {
      reply: "Hello! I am Leenu, voice assistant representing Laureen Simberg. Laureen is an Estonian Junior National Team biathlete, Youth Olympic Games 12th place finisher, and an undergraduate student studying Impactful Entrepreneurship at Estonian Business School (EBS). How may I assist you today?",
      detectedLanguage: 'en',
    };
  }
}
