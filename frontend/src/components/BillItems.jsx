import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

const BillItems = () => {
  return (
    <div className="flex flex-col gap-6 mt-5">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline Variant</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Add
          </Button>
        </ItemActions>
      </Item>
      
    </div>
  )
}

export default BillItems