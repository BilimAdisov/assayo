import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ISort from 'ts/interfaces/Sort';
import Table from 'ts/components/Table';
import Cards from 'ts/components/Cards';
import viewSettings from 'ts/store/ViewSettings';
import globalScroll from 'ts/helpers/globalScroll';
import { downloadExcel } from 'ts/helpers/File';
import isMobile from 'ts/helpers/isMobile';

import style from './index.module.scss';
import PageWrapper from '../Page/wrapper';

interface IDataViewProps {
  rowsForExcel?: any[];
  rows: any[];
  type?: string;
  sort?: ISort[];
  columnCount?: number,
  className?: string,
  disabledRow?: (row: any) => boolean;
  converterToCsv?: Function,
  updateSort?: Function,
  children: React.ReactNode | React.ReactNode[];
}

function DataView({
  rowsForExcel = [],
  rows = [],
  sort = [],
  type,
  columnCount,
  className,
  disabledRow,
  updateSort,
  children,
}: IDataViewProps): React.ReactElement | null {
  const { t } = useTranslation();
  const urlParams = useParams<any>();
  const defaultType = viewSettings.getItem(urlParams, isMobile ? 'cards' : 'table');
  const [localType, setType] = useState<string>(type || defaultType);
  const [fullSize, setFullSize] = useState<boolean>(false);

  if (!rows || !rows.length) return null;

  const icon = {
    table: './assets/icons/Cards.svg',
    cards: './assets/icons/Table.svg',
  }[localType];

  const titleForType = {
    table: 'Отобразить карточками',
    cards: 'Отобразить таблицой',
  }[localType];

  const fullSizeClass = fullSize ? style.data_view_full_screen : '';

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div className={style.data_view_buttons}>
          {!isMobile && (
            <img
              title={'Скачать XLSX'}
              src="./assets/icons/Download.svg"
              className={style.data_view_icon}
              onClick={() => {
                const fileName = t(`sidebar.${urlParams.type}.${urlParams.page}`);
                downloadExcel(rowsForExcel || rows, children, fileName);
              }}
            />
          )}
          {false && !isMobile && (
            <img
              title={'Развернуть'}
              src="./assets/icons/OpenFullscreen.svg"
              className={style.data_view_icon}
              onClick={() => {
                if (fullSize) {
                  globalScroll.off();
                } else {
                  globalScroll.on();
                }
                setFullSize(!fullSize);
              }}
            />
          )}
          {!isMobile && (
            <img
              title={titleForType}
              src={icon}
              className={style.data_view_icon}
              onClick={() => {
                const newType = localType === 'table' ? 'cards' : 'table';
                setType(newType);
                viewSettings.setItem(urlParams, newType, 'table');
              }}
            />
          )}
        </div>
      </div>

      {localType === 'table' && (
        <PageWrapper
          template="table"
          className={fullSizeClass}
        >
          <Table
            rows={rows}
            sort={sort}
            disabledRow={disabledRow}
            updateSort={updateSort}
          >
            {children}
          </Table>
        </PageWrapper>
      )}

      {localType === 'cards' && (
        <Cards
          items={rows}
          columnCount={columnCount}
          className={className}
        >
          {children}
        </Cards>
      )}
    </>
  );
}

DataView.defaultProps = {
  rows: [],
  sort: [],
  type: undefined,
  columnCount: undefined,
  updateSort: () => {
  },
};

export default DataView;
