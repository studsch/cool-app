import AvatarBlock from "../avatarblock/avatarblock";

type Props = {
  className?: string;
};

const MyContacts: React.FC<Props | any> = props => {
  return (
    <>
      <div>
        <h2 className="text-text-primary-color text-lg weigh mx-auto w-fit font-bold">
          My Contacts
        </h2>
        <div className="gap-5 flex flex-col">
          <AvatarBlock
            title="Stanko Dmitry"
            subtitle="@stanko1234"
            classNames={{ img: "h-12 w-12" }}
          />
          <AvatarBlock
            title="Stanko Dmitry"
            subtitle="@stanko1234"
            classNames={{ img: "h-12 w-12" }}
          />
          <AvatarBlock
            title="Stanko Dmitry"
            subtitle="@stanko1234"
            classNames={{ img: "h-12 w-12" }}
          />
        </div>
      </div>
    </>
  );
};

export default MyContacts;
