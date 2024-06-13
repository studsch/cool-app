import PeopleCard from "../people-card/people-card";

const People: React.FC = () => {
  return (
    <>
      <div className="w-[300px]  mx-4">
        <p className="text-lg font-medium text-text-primary-color my-4">
          Пользователи
        </p>
        <div className="flex flex-col gap-3">
          {/* Когда решим какие данные будут передовать напишу пример мапы */}
          <PeopleCard></PeopleCard>
          <PeopleCard></PeopleCard>
        </div>
      </div>
    </>
  );
};

export default People;
