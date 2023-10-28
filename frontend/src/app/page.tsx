import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";

export default function Home() {
  return (
    <div>
      <Button className="btn btn-primary" type="button" text="Search" />
      <Button className="btn btn-secondary" type="button" text="Popular" />
      <Input
        className="input input-primary"
        placeholder="Password"
        type="password"
      />
      <div>
        <Input
          className="input input-secondary"
          placeholder="number"
          type="tel"
        />
      </div>
    </div>
  );
}
