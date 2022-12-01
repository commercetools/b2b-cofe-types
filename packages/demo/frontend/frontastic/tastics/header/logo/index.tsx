import Image from 'frontastic/lib/image';
import { ReferenceLink } from 'helpers/reference';
import React from 'react';

type Props = {
  data: any;
};

const Logo: React.FC<Props> = ({ data }) => {
  const logo = data.logo;
  const logoLink = data.logoLink;
  return (
    <ReferenceLink target={logoLink} className="flex h-full items-center py-4 pr-2 md:py-3">
      <span className="sr-only">Catwalk</span>
      <div className="relative mx-6 h-14 w-[60px] sm:w-[120px]">
        <Image
          media={logo.media ? logo.media : { media: {} }}
          className="dark:invert"
          layout="fill"
          objectFit="contain"
          alt="Logo"
        />
      </div>
    </ReferenceLink>
  );
};

export default Logo;
