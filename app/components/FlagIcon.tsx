import React from 'react';
import CountryFlag from 'react-native-country-flag';

interface FlagIconProps {
  countryCode: string;
  size?: number;
}

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, size = 24 }) => {
  // Chuyển đổi mã quốc gia sang định dạng ISO 3166-1 alpha-2
  const getISOCode = (code: string): string => {
    const codeMap: { [key: string]: string } = {
      'gb': 'gb', // Giữ nguyên mã GB cho cờ Anh
      'cn': 'cn', // Giữ nguyên mã CN cho cờ Trung Quốc
      'jp': 'jp', // Giữ nguyên mã JP cho cờ Nhật Bản
      'kr': 'kr', // Giữ nguyên mã KR cho cờ Hàn Quốc
    };
    return codeMap[code.toLowerCase()] || code.toLowerCase();
  };

  return (
    <CountryFlag
      isoCode={getISOCode(countryCode)}
      size={size}
    />
  );
};

export default FlagIcon;