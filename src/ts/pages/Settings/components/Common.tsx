import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import InputString from 'ts/components/UiKit/components/InputString';
import Select from 'ts/components/UiKit/components/Select';
import PageBox from 'ts/components/Page/Box';
import Title from 'ts/components/Title';
import localization from 'ts/helpers/Localization';

const Common = observer((): React.ReactElement | null => {
  const [title, setTitle] = useState<string>(document.title);
  const [language, setLanguage] = useState<string>(localization.language);

  return (
    <>
      <Title title="page.settings.document.title"/>
      <PageBox>
        <InputString
          title="page.settings.document.name"
          value={title}
          placeholder="Git статистика"
          onChange={(value: string) => {
            setTitle(value);
            document.title = value || 'Git статистика';
          }}
        />
        <Select
          title="page.settings.document.language"
          value={language}
          options={[
            { id: 'ru', title: 'Русский' },
            { id: 'en', title: 'English' },
          ]}
          onChange={(item: any, id: string) => {
            localization.language = id;
            setLanguage(id);
          }}
        />
      </PageBox>
    </>
  );
});

export default Common;
