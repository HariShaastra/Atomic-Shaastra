export const shareToWhatsApp = (text: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

export const getSharingText = (type: 'habit' | 'identity' | 'experiment' | 'reflection' | 'stats', data: any) => {
  const baseUrl = "Atomic Shaastra: Build your systems, become your identity.\n\n";
  
  switch (type) {
    case 'habit':
      return `${baseUrl}I just completed my "${data.name}" habit! Join me on the path to elite consistency. 🚀`;
    case 'identity':
      return `${baseUrl}I am building a new identity: "${data.name}". Evolution is a choice. 💎`;
    case 'stats':
      return `${baseUrl}My productivity stats are hitting new peaks on Atomic Shaastra! LVL ${data.level} reached. 📈`;
    default:
      return `${baseUrl}Check out my progress on Atomic Shaastra!`;
  }
};
