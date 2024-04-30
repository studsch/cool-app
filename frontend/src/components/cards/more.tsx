import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export function PostMore() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <FontAwesomeIcon
            icon={faEllipsis}
            size="xl"
            className="text-text-primary-color hover:bg-slate-50 rounded-xl p-1 transition"
          ></FontAwesomeIcon>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Keyboard shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
