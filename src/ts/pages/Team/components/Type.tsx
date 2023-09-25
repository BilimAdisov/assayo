import React from 'react';
import { observer } from 'mobx-react-lite';

import IHashMap from 'ts/interfaces/HashMap';
import ISort from 'ts/interfaces/Sort';
import { IPaginationRequest, IPagination } from 'ts/interfaces/Pagination';
import dataGripStore from 'ts/store/DataGrip';

import PageWrapper from 'ts/components/Page/wrapper';
import ICommonPageProps from 'ts/components/Page/interfaces/CommonPageProps';
import DataLoader from 'ts/components/DataLoader';
import Pagination from 'ts/components/DataLoader/components/Pagination';
import getFakeLoader from 'ts/components/DataLoader/helpers/formatter';
import NothingFound from 'ts/components/NothingFound';
import Title from 'ts/components/Title';
import Table from 'ts/components/Table';
import Column from 'ts/components/Table/components/Column';
import { ColumnTypesEnum } from 'ts/components/Table/interfaces/Column';
import LineChart from 'ts/components/LineChart';
import getOptions from 'ts/components/LineChart/helpers/getOptions';
import RecommendationsWrapper from 'ts/components/Recommendations/wrapper';
import Description from 'ts/components/Description';

import { getMax } from 'ts/pages/Common/helpers/getMax';

interface ITypeViewProps {
  response?: IPagination<any>;
  updateSort?: Function;
}

function TypeView({ response, updateSort }: ITypeViewProps) {
  if (!response) return null;

  const taskChart = getOptions({ max: getMax(response, 'tasks'), suffix: 'задач' });
  const daysByAuthorsChart = getOptions({ max: getMax(response, 'daysByAuthorsTotal'), suffix: 'дней' });
  const authorChart = getOptions({ order: dataGripStore.dataGrip.author.list });

  return (
    <Table
      rows={response.content}
      sort={response.sort}
      updateSort={updateSort}
    >
      <Column
        isFixed
        template={ColumnTypesEnum.STRING}
        title="page.team.type.type"
        properties="type"
        width={150}
      />
      <Column
        template={ColumnTypesEnum.SHORT_NUMBER}
        properties="tasks"
      />
      <Column
        isSortable
        title="page.team.type.tasks"
        properties="tasks"
        minWidth={120}
        template={(value: number) => (
          <LineChart
            options={taskChart}
            value={value}
          />
        )}
      />
      <Column
        template={ColumnTypesEnum.SHORT_NUMBER}
        title="page.team.type.days"
        properties="days"
      />
      <Column
        template={ColumnTypesEnum.SHORT_NUMBER}
        properties="daysByAuthorsTotal"
      />
      <Column
        isSortable
        title="page.team.type.authorsDays"
        properties="daysByAuthorsTotal"
        minWidth={120}
        template={(value: number) => (
          <LineChart
            options={daysByAuthorsChart}
            value={value}
          />
        )}
      />
      <Column
        template={ColumnTypesEnum.NUMBER}
        title="page.team.type.commits"
        properties="commits"
      />
      <Column
        title="page.team.type.authors"
        properties="commitsByAuthors"
        template={(details: IHashMap<number>) => (
          <LineChart
            options={authorChart}
            details={details}
          />
        )}
        minWidth={500}
      />
    </Table>
  );
}

TypeView.defaultProps = {
  response: undefined,
};

const Type = observer(({
  mode,
}: ICommonPageProps): React.ReactElement | null => {
  const rows = dataGripStore.dataGrip.type.statistic;
  if (!rows?.length) return mode !== 'print' ? (<NothingFound />) : null;
  const recommendations = dataGripStore.dataGrip.recommendations.team?.byType;

  return (
    <>
      {mode !== 'print' && (
        <RecommendationsWrapper recommendations={recommendations} />
      )}
      <Title title="Статистика по типам задач"/>
      <PageWrapper template="table">
        <DataLoader
          to="response"
          loader={(pagination?: IPaginationRequest, sort?: ISort[]) => getFakeLoader({
            content: rows, pagination, sort, mode,
          })}
        >
          <TypeView />
          <Pagination />
        </DataLoader>
      </PageWrapper>
      <PageWrapper>
        <Description
          text="*Персональный вклад* считается по количеству коммитов, а не объему измененных строк или файлов. Поэтому следует так же смотреть раздел «Анализ файлов», чтобы оценить масштаб изменений."
        />
      </PageWrapper>
    </>
  );
});

export default Type;