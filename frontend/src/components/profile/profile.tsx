import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

export interface ProfileProps {
  info: {
    avatarImage: string;
    avatarFallback: string;
    name: string;
    description: string;
  };
}

export function Profile({ info }: ProfileProps) {
  return (
    <Card className="w-[600px]">
      {/* TODO: add image */}
      <div className="bg-black w-full h-36 rounded-t-xl"></div>

      <div className="flex mx-1">
        <div className="bg-white rounded-full w-[108px] h-[108px] -mt-[50px]">
          <div className="p-1">
            <Avatar className="w-[100px] h-[100px]">
              <AvatarImage src={info.avatarImage} />
              <AvatarFallback>{info.avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex w-full justify-between my-2 mx-2">
          <div className="grid gap-1">
            <p className="text-lg font-medium leading-none">{info.name}</p>
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {info.description}
            </p>
          </div>
          <div className="grid gap-1 w-[200px]">
            <Button className="text-white">Edit profile</Button>
            <Button className="text-white">More action</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
